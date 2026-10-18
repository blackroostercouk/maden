import { detectApps, type ScannedPage } from "./apps";
import {
  fetchJson,
  fetchProducts,
  productPage,
  summariseCollections,
  summariseProducts,
} from "./catalog";
import { readLanguages, readPage, readShop, readTheme } from "./html";
import { fetchMeta } from "./meta";
import { detectPayments } from "./payments";
import { safeFetch, type SafeResponse } from "./safeFetch";
import { detectPlan, detectShopify } from "./shopify";
import { measureStorefront } from "./storefront";
import { parseTarget } from "./target";
import type { ShopifyCheck, StoreAnalysis } from "./types";

/** Why an analysis could not be produced. The page has a message for each. */
export type Failure = {
  ok: false;
  reason: "invalid-url" | "unreachable" | "not-shopify" | "blocked";
  host?: string;
};

async function openHome(origin: string): Promise<SafeResponse | null> {
  try {
    const response = await safeFetch(`${origin}/`);
    return response.status < 400 || response.body.length > 500 ? response : null;
  } catch {
    return null;
  }
}

const hasProducts = (feed: { products?: unknown[] } | null) => Array.isArray(feed?.products);

/**
 * Full read of a public store. Everything but "is it Shopify" and "can we
 * see its products" is optional: what we cannot read becomes a note.
 */
export async function analyseStore(
  input: string,
): Promise<{ ok: true; analysis: StoreAnalysis } | Failure> {
  const target = parseTarget(input);
  if (!target) return { ok: false, reason: "invalid-url" };
  const { origin, host } = target;
  const notes: string[] = [];

  const [home, firstProducts, collectionsRaw, meta] = await Promise.all([
    openHome(origin),
    productPage(origin, 1),
    fetchJson<Parameters<typeof summariseCollections>[0]>(origin, "/collections.json?limit=250"),
    fetchMeta(origin),
  ]);
  if (!home && !hasProducts(firstProducts)) return { ok: false, reason: "unreachable", host };

  const html = home?.body ?? "";
  const shopify: ShopifyCheck = detectShopify({
    headers: home?.headers ?? {},
    html,
    productsFeed: hasProducts(firstProducts),
  });
  if (!shopify.isShopify) return { ok: false, reason: "not-shopify", host };

  const catalog = await fetchProducts(origin, firstProducts);
  if (!catalog) return { ok: false, reason: "blocked", host };

  const homePage = readPage(html);
  const shop = readShop(html);
  const theme = readTheme(html);

  // A product page shows apps that never load on the home page (reviews, subscriptions)
  const sample = catalog.products.find((product) => product.handle)?.handle;
  const pages: ScannedPage[] = [{ page: homePage, kind: "home" }];
  const pagesScanned = ["/"];
  const [productResponse, storefront] = await Promise.all([
    sample
      ? safeFetch(`${origin}/products/${encodeURIComponent(sample)}`).catch(() => null)
      : Promise.resolve(null),
    measureStorefront(host, homePage),
  ]);
  if (productResponse?.status === 200) {
    pages.push({ page: readPage(productResponse.body), kind: "product" });
    pagesScanned.push(`/products/${sample}`);
  } else if (sample) {
    notes.push("The product page could not be opened, so product-page apps may be missing.");
  }

  if (home?.url.includes("/password"))
    notes.push("The store is password protected, so most details are hidden.");
  if (!theme) notes.push("The theme name is not printed in this store's pages.");
  if (!collectionsRaw) notes.push("The public collection list is switched off.");
  if (catalog.capped) notes.push("The store has more products than we counted.");
  if (collectionsRaw?.collections?.length === 250)
    notes.push("The store has more collections than we counted.");

  // /meta.json knows the store's own currency and country; pages are priced for the visitor
  const currency = meta?.currency ?? shop.currency;
  return {
    ok: true,
    analysis: {
      url: origin,
      host,
      analysedAt: new Date().toISOString(),
      title: homePage.title,
      siteName: homePage.siteName ?? meta?.name ?? null,
      description: homePage.description ?? meta?.description ?? null,
      shopify,
      myshopifyDomain: meta?.myshopifyDomain ?? shop.myshopifyDomain ?? shopify.myshopifyDomain,
      theme,
      plan: detectPlan(host, homePage, meta?.domain ?? null),
      locale: {
        currency,
        country: meta?.country ?? shop.country,
        languages: readLanguages(homePage, shop.language),
      },
      payments: detectPayments(pages.map((entry) => entry.page)),
      storefront,
      products: summariseProducts(catalog.products, catalog.capped, currency),
      totals: {
        products: meta?.productsCount ?? null,
        collections: meta?.collectionsCount ?? null,
      },
      collections: summariseCollections(collectionsRaw),
      apps: detectApps(pages),
      pagesScanned,
      notes,
    },
  };
}
