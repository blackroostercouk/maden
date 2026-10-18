import { safeFetch } from "./safeFetch";
import type { CollectionSummary, PriceBucket, ProductSummary } from "./types";

const PAGE_SIZE = 250;
const MAX_PAGES = 4;

type RawVariant = { price?: string; compare_at_price?: string | null; available?: boolean };
type RawProduct = {
  title?: string;
  handle?: string;
  vendor?: string;
  product_type?: string;
  published_at?: string | null;
  created_at?: string | null;
  variants?: RawVariant[];
  images?: Array<{ src?: string }>;
};

export async function fetchJson<T>(origin: string, path: string): Promise<T | null> {
  try {
    const response = await safeFetch(`${origin}${path}`, {
      accept: "application/json",
      maxBytes: 6_000_000,
    });
    if (response.status !== 200 || response.truncated) return null;
    return JSON.parse(response.body) as T;
  } catch {
    return null;
  }
}

export const productPage = (origin: string, page: number) =>
  fetchJson<{ products?: RawProduct[] }>(origin, `/products.json?limit=${PAGE_SIZE}&page=${page}`);

export async function fetchProducts(origin: string, first: { products?: RawProduct[] } | null) {
  if (!first?.products) return null;
  const pages = [first.products];
  if (first.products.length === PAGE_SIZE) {
    const rest = await Promise.all(
      Array.from({ length: MAX_PAGES - 1 }, (_, i) => productPage(origin, i + 2)),
    );
    for (const page of rest) {
      if (!page?.products?.length) break;
      pages.push(page.products);
    }
  }
  return {
    products: pages.flat(),
    capped: pages.length === MAX_PAGES && pages[pages.length - 1].length === PAGE_SIZE,
  };
}

const number = (value: unknown) => {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

const ranked = (values: Array<string | undefined>, limit = Infinity) => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const name = value?.trim();
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

/** Rounds to a tidy number: 1, 2, 2.5, 5 or 10 times a power of ten. */
function niceNumber(value: number) {
  if (value <= 0) return 0;
  const power = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  return steps
    .map((step) => step * power)
    .reduce((best, step) => (Math.abs(step - value) < Math.abs(best - value) ? step : best));
}

/** Up to five price bands whose edges are tidy numbers near the 20th, 40th, 60th and 80th percentiles. */
export function priceBuckets(sorted: number[]): PriceBucket[] {
  if (sorted.length === 0) return [];
  const at = (share: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * share))];
  const edges = [
    ...new Set(
      [0.2, 0.4, 0.6, 0.8].map((share) => niceNumber(at(share))).filter((edge) => edge > sorted[0]),
    ),
  ].sort((a, b) => a - b);
  const bands: PriceBucket[] = [];
  let from = 0;
  for (const edge of edges) {
    bands.push({
      from,
      to: edge,
      count: sorted.filter((price) => price >= from && price < edge).length,
    });
    from = edge;
  }
  bands.push({ from, to: null, count: sorted.filter((price) => price >= from).length });
  return bands.filter((band) => band.count > 0);
}

/** Only Shopify's own image host is shown, which keeps the page's image policy tight. */
const shopifyImage = (src: string | undefined) => {
  if (!src) return null;
  try {
    const url = new URL(src);
    if (url.protocol !== "https:" || url.hostname !== "cdn.shopify.com") return null;
    url.searchParams.set("width", "480");
    return url.href;
  } catch {
    return null;
  }
};

function cheapest(variants: RawVariant[] = []) {
  let best: { price: number; compareAt: number | null } | null = null;
  for (const variant of variants) {
    const price = number(variant.price);
    if (price === null) continue;
    if (!best || price < best.price) best = { price, compareAt: number(variant.compare_at_price) };
  }
  return best;
}

export function summariseProducts(
  products: RawProduct[],
  capped: boolean,
  currency: string | null,
): ProductSummary {
  const prices: number[] = [];
  let onSale = 0;
  let available = 0;
  let variants = 0;
  for (const product of products) {
    const best = cheapest(product.variants);
    if (best) prices.push(best.price);
    variants += product.variants?.length ?? 0;
    if (
      product.variants?.some(
        (v) => (number(v.compare_at_price) ?? 0) > (number(v.price) ?? Infinity),
      )
    )
      onSale++;
    if (product.variants?.some((v) => v.available)) available++;
  }
  prices.sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const median =
    prices.length === 0 ? 0 : prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
  const mean =
    prices.length === 0 ? 0 : prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const newest = [...products]
    .filter((product) => product.title && product.handle)
    .sort(
      (a, b) =>
        Date.parse(b.published_at ?? b.created_at ?? "") -
        Date.parse(a.published_at ?? a.created_at ?? ""),
    )
    .slice(0, 8)
    .map((product) => {
      const best = cheapest(product.variants);
      return {
        title: product.title as string,
        handle: product.handle as string,
        type: product.product_type?.trim() || null,
        price: best?.price ?? null,
        compareAtPrice: best?.compareAt && best.price < best.compareAt ? best.compareAt : null,
        image: shopifyImage(product.images?.[0]?.src),
        publishedAt: product.published_at ?? product.created_at ?? null,
      };
    });

  return {
    count: products.length,
    countCapped: capped,
    variants,
    vendors: new Set(products.map((p) => p.vendor?.trim()).filter(Boolean)).size,
    currency,
    price: prices.length ? { min: prices[0], median, mean, max: prices[prices.length - 1] } : null,
    priceBuckets: priceBuckets(prices),
    onSale,
    availableShare: products.length ? available / products.length : null,
    types: ranked(products.map((p) => p.product_type)),
    newest,
  };
}

export function summariseCollections(
  raw: { collections?: Array<{ title?: string; handle?: string; products_count?: number }> } | null,
): CollectionSummary | null {
  if (!raw?.collections) return null;
  const list = raw.collections.filter((c) => c.title && c.handle);
  // "All products" and product-feed collections only repeat the whole catalogue
  const distinct = list.filter((c) => !/^(all|frontpage)$|feed/i.test(c.handle as string));
  return {
    count: list.length,
    countCapped: raw.collections.length >= PAGE_SIZE,
    top: [...distinct]
      .sort((a, b) => (b.products_count ?? 0) - (a.products_count ?? 0))
      .slice(0, 12)
      .map((c) => ({
        title: c.title as string,
        handle: c.handle as string,
        products: c.products_count ?? 0,
      })),
  };
}
