import type { ThemeInfo } from "./types";

/** What we pull out of a page's markup. All of it is public, in the page source. */
export type PageFacts = {
  title: string | null;
  /** og:site_name, the store's own name for itself. */
  siteName: string | null;
  description: string | null;
  /** hreflang alternates: the page's other language and region versions. */
  alternates: Array<{ lang: string; href: string }>;
  /** Targets of the page's links. */
  links: string[];
  /** Addresses of external scripts only. */
  scripts: string[];
  /** Every <script> tag, external or inline. */
  scriptTags: number;
  /** Addresses the page loads: scripts, stylesheets, preconnects, frames. */
  resources: string[];
  /** Text of inline scripts (capped), where many apps leave their ID. */
  inlineScripts: string;
  /** Whole page, lower-cased, for class and id markers. */
  markup: string;
};

const MAX_INLINE_SCRIPT_CHARS = 700_000;

const decode = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag: string, name: string) =>
  tag
    .match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))
    ?.slice(1)
    .find((v) => v !== undefined) ?? null;

export function readPage(html: string): PageFacts {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const description = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /name\s*=\s*["']description["']/i.test(tag));

  const siteName = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /property\s*=\s*["']og:site_name["']/i.test(tag));

  const alternates: PageFacts["alternates"] = [];
  const links = new Set<string>();
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(match[0], "href");
    if (href) links.add(decode(href));
  }

  const scripts: string[] = [];
  const resources = new Set<string>();
  for (const match of html.matchAll(/<(script|link|iframe)\b[^>]*>/gi)) {
    const tag = match[0];
    const kind = match[1].toLowerCase();
    const url = attr(tag, kind === "link" ? "href" : "src");
    if (kind === "link" && /rel\s*=\s*["']?alternate/i.test(tag) && /hreflang/i.test(tag) && url) {
      const lang = attr(tag, "hreflang");
      if (lang) alternates.push({ lang: lang.toLowerCase(), href: decode(url) });
    }
    if (kind === "script" && url) scripts.push(decode(url));
    if (!url) continue;
    if (kind === "link" && /rel\s*=\s*["']?(alternate|canonical|shortlink|amphtml)/i.test(tag))
      continue;
    resources.add(decode(url));
  }

  let inline = "";
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\ssrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
    inline += `${match[2]}\n`;
    if (inline.length > MAX_INLINE_SCRIPT_CHARS) break;
  }

  return {
    title: title ? decode(title) : null,
    siteName: siteName ? decode(attr(siteName, "content") ?? "") || null : null,
    alternates,
    links: [...links],
    scripts,
    scriptTags: (html.match(/<script\b/gi) ?? []).length,
    description: description ? decode(attr(description, "content") ?? "") || null : null,
    resources: [...resources],
    inlineScripts: inline.slice(0, MAX_INLINE_SCRIPT_CHARS).toLowerCase(),
    markup: html.toLowerCase(),
  };
}

/** Reads `Shopify.xyz = {...};` assignments that Shopify prints into every storefront. */
function shopifyObject(html: string, key: string) {
  const start = html.search(new RegExp(`Shopify\\.${key}\\s*=\\s*\\{`));
  if (start === -1) return null;
  const open = html.indexOf("{", start);
  let depth = 0;
  let inString = false;
  for (let i = open; i < Math.min(html.length, open + 4000); i++) {
    const char = html[i];
    if (inString) {
      if (char === "\\") i++;
      else if (char === '"') inString = false;
    } else if (char === '"') inString = true;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) {
      try {
        return JSON.parse(html.slice(open, i + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
  }
  return null;
}

const shopifyString = (html: string, key: string) =>
  html.match(new RegExp(`Shopify\\.${key}\\s*=\\s*"([^"]{1,120})"`))?.[1] ?? null;

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

/**
 * Online Store 2.0 themes build pages from JSON templates, which gives every
 * section an id like "shopify-section-template--123__hero". Older themes use
 * plain "shopify-section-hero".
 */
function onlineStore2(html: string) {
  if (/shopify-section-template--\d+__/.test(html)) return true;
  return /id=["']shopify-section-[a-z]/i.test(html) ? false : null;
}

export function readTheme(html: string): ThemeInfo | null {
  const theme = shopifyObject(html, "theme");
  const name = theme && text(theme.name);
  if (!theme || !name) return null;
  return {
    name,
    baseName: text(theme.schema_name),
    version: text(theme.schema_version),
    // Themes bought from the Shopify Theme Store carry a store ID; custom and
    // marketplace themes do not
    source: theme.theme_store_id ? "theme-store" : "custom",
    themeStoreId: typeof theme.theme_store_id === "number" ? theme.theme_store_id : null,
    onlineStore2: onlineStore2(html),
  };
}

export function readShop(html: string) {
  const currency = shopifyObject(html, "currency");
  return {
    myshopifyDomain: shopifyString(html, "shop"),
    currency: currency ? text(currency.active) : null,
    country: shopifyString(html, "country"),
    language: shopifyString(html, "locale"),
  };
}

/** Language codes a storefront offers: its hreflang alternates plus the language it is showing now. */
export function readLanguages(page: PageFacts, current: string | null): string[] {
  const codes = [current, ...page.alternates.map((alternate) => alternate.lang)]
    .map((code) => code?.toLowerCase().split(/[-_]/)[0])
    .filter(
      (code): code is string =>
        Boolean(code) && code !== "x" && /^[a-z]{2,3}$/.test(code as string),
    );
  return [...new Set(codes)];
}
