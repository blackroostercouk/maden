import { fetchJson } from "./catalog";

/**
 * Shopify stores publish a small profile of themselves at /meta.json: the
 * name, home country and currency, and honest product and collection totals.
 * It is the most reliable source for those, because storefront pages are
 * translated and priced for whoever is looking (here, our server).
 */
export type StoreMeta = {
  name: string | null;
  /** Two-letter country code of the store's address. */
  country: string | null;
  /** The store's own currency, the one product prices are listed in. */
  currency: string | null;
  description: string | null;
  myshopifyDomain: string | null;
  /** The store's primary domain, which for Plus stores can be a checkout subdomain. */
  domain: string | null;
  productsCount: number | null;
  collectionsCount: number | null;
};

type RawMeta = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);
const count = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

/** Parses a /meta.json body, or returns null when it is not a Shopify profile. */
export function parseMeta(raw: unknown): StoreMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const meta = raw as RawMeta;
  const myshopifyDomain = text(meta.myshopify_domain);
  if (!myshopifyDomain?.endsWith(".myshopify.com")) return null;
  const currency = text(meta.currency);
  return {
    name: text(meta.name),
    country: text(meta.country),
    currency: currency && /^[A-Za-z]{3}$/.test(currency) ? currency.toUpperCase() : null,
    description: text(meta.description),
    myshopifyDomain,
    domain: text(meta.domain)?.toLowerCase() ?? null,
    productsCount: count(meta.published_products_count),
    collectionsCount: count(meta.published_collections_count),
  };
}

export async function fetchMeta(origin: string): Promise<StoreMeta | null> {
  return parseMeta(await fetchJson<unknown>(origin, "/meta.json"));
}
