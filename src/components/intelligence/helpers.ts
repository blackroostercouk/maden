export const fmt = (n: number) => Number(n).toLocaleString("en-GB");

export const money = (n: number, cur = "GBP") => {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: n % 1 ? 2 : 0,
    }).format(n);
  } catch {
    return String(n);
  }
};

export const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 .]/g, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export type Target = { host: string } | { error: string };

/** Turns what was typed into a bare domain, or says what is wrong with it. */
export function normaliseUrl(raw: string): Target {
  const bad = "That doesn't look like a web address. Try something like brand.com.";
  let value = raw.trim();
  if (!value) return { error: "Enter a store address, like brand.com." };
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { error: bad };
  }
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || /\s/.test(host)) return { error: bad };
  return { host: host.replace(/^www\./, "") };
}

export type NoticeCode = "not-shopify" | "unreachable" | "blocked" | "busy" | "invalid";

export const notices: Record<
  NoticeCode,
  (host: string) => { eyebrow: string; title: string; text: string }
> = {
  "not-shopify": (h) => ({
    eyebrow: "Not a Shopify store",
    title: `${h} doesn't run on Shopify.`,
    text: "We couldn't find Shopify's storefront signals on this site, so there's no catalogue feed to read. Check the address, or try the brand's main shop domain.",
  }),
  unreachable: (h) => ({
    eyebrow: "Couldn't reach the store",
    title: `${h} didn't respond.`,
    text: "The site may be down, password protected or blocking automated requests. Check the address and try again in a minute.",
  }),
  blocked: (h) => ({
    eyebrow: "Catalogue hidden",
    title: `${h} hides its product feed.`,
    text: "The store runs on Shopify but has turned off its public product and collection feeds, so counts aren't available.",
  }),
  busy: () => ({
    eyebrow: "Too many analyses",
    title: "Slow down a moment.",
    text: "Each analysis reads several pages of a store, so there's a limit on how many you can run at once. Try again in a few minutes.",
  }),
  invalid: () => ({
    eyebrow: "Check the address",
    title: "That address couldn't be analysed.",
    text: "Enter the store's domain, like brand.com, without a page path.",
  }),
};

export const STEPS = [
  { label: "Fetching the storefront", meta: "Home page" },
  { label: "Confirming it runs on Shopify", meta: "Shopify signals" },
  { label: "Reading the catalogue", meta: "products.json" },
  { label: "Reading collections", meta: "collections.json" },
  { label: "Detecting apps and pixels", meta: "Scripts and markup" },
  { label: "Estimating the plan", meta: "Plus signals" },
] as const;
