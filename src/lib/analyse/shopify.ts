import type { PageFacts } from "./html";
import type { PlanEvidence, ShopifyCheck } from "./types";

type Evidence = {
  headers: Record<string, string>;
  html: string;
  /** True when /products.json answered with a product list. */
  productsFeed: boolean;
};

/** Is this a Shopify storefront? Several independent tells, any strong one is enough. */
export function detectShopify({ headers, html, productsFeed }: Evidence): ShopifyCheck {
  const signals: string[] = [];
  const poweredBy = headers["powered-by"]?.toLowerCase() ?? "";
  const headless = poweredBy.includes("hydrogen");

  if (poweredBy.includes("shopify")) signals.push("Shopify response header");
  if (headers["x-shopid"] || headers["x-shopify-stage"]) signals.push("Shopify shop ID header");
  if (/Shopify\.(shop|theme)\s*=/.test(html)) signals.push("Shopify storefront script");
  if (productsFeed) signals.push("Public Shopify products feed");

  // Custom front ends (Hydrogen, Next.js) hide the usual tells but still point at Shopify's own domains
  const myshopify =
    html.match(/Shopify\.shop\s*=\s*"([a-z0-9-]+\.myshopify\.com)"/i)?.[1] ??
    html.match(/\b([a-z0-9][a-z0-9-]*\.myshopify\.com)\b/i)?.[1]?.toLowerCase() ??
    null;
  if (myshopify && !signals.includes("Shopify storefront script"))
    signals.push("Shopify store domain in the page");
  const assets = html.match(/cdn\.shopify\.com\/s\/files|\/cdn\/shop\//g)?.length ?? 0;
  if (assets >= 5) signals.push("Shopify image and asset hosting");

  const isShopify = signals.length > 0;
  return {
    isShopify,
    signals,
    headless: isShopify && (headless || !/Shopify\.theme\s*=/.test(html)),
    myshopifyDomain: myshopify,
  };
}

const SECOND_LEVEL = ["co", "com", "org", "net", "gov", "ac"];

/** "www.shop.brand.co.uk" gives "brand.co.uk"; enough to tell one brand's domains from another's. */
function siteRoot(host: string) {
  const labels = host.replace(/^www\./, "").split(".");
  const keep =
    labels.length > 2 &&
    labels[labels.length - 1].length === 2 &&
    SECOND_LEVEL.includes(labels[labels.length - 2])
      ? 3
      : 2;
  return labels.slice(-keep).join(".");
}

/** "www.shop.brand.co.uk" gives ["shop.brand.co.uk", "brand.co.uk", "co.uk"]. */
function domainCandidates(host: string) {
  const labels = host.replace(/^www\./, "").split(".");
  const candidates: string[] = [];
  for (let i = 0; i <= Math.max(0, labels.length - 2); i++)
    candidates.push(labels.slice(i).join("."));
  return candidates.filter((name) => name.includes("."));
}

const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return null;
  }
};

/**
 * Shopify does not publish which plan a store is on, so this only gathers
 * tells. A checkout on the brand's own subdomain, separate stores per region
 * and a wholesale login are things Plus stores commonly have; their absence
 * proves nothing.
 */
export function detectPlan(
  host: string,
  page: PageFacts,
  primaryDomain: string | null = null,
): PlanEvidence {
  let checkoutHost: string | null = null;
  // The store's primary domain can itself be a checkout subdomain of the brand
  if (
    primaryDomain &&
    /(^|\.)checkout\./.test(primaryDomain) &&
    siteRoot(primaryDomain) === siteRoot(host)
  ) {
    checkoutHost = primaryDomain;
  }
  for (const domain of checkoutHost ? [] : domainCandidates(host)) {
    const escaped = domain.replace(/\./g, "\\.");
    const found = page.markup.match(new RegExp(`[a-z0-9.-]*checkout\\.${escaped}`));
    if (found) {
      checkoutHost = found[0];
      break;
    }
  }

  const root = siteRoot(host);
  const expansionDomains = [
    ...new Set(
      page.alternates
        .map((alternate) => hostOf(alternate.href))
        .filter((name): name is string => Boolean(name) && siteRoot(name as string) !== root)
        .map((name) => siteRoot(name)),
    ),
  ].slice(0, 5);

  const b2bLink =
    page.links.find((link) => {
      const sameSite =
        link.startsWith("/") ||
        (hostOf(link) !== null && siteRoot(hostOf(link) as string) === root);
      return sameSite && /wholesale|\/pages\/trade|\/b2b|trade-account/i.test(link);
    }) ?? null;

  return { checkoutHost, expansionDomains, b2bLink };
}
