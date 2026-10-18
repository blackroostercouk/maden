import { categoryLabels, categoryOrder } from "./signatures";
import type { AppCategory, AppScope, PriceBucket, StoreAnalysis } from "./types";

/**
 * The shape the store intelligence page renders (public/intelligence.html,
 * "DATA CONTRACT"). Everything on that page is read from this object.
 */
export type Report = {
  query: string;
  analysedAt: string;
  isShopify: true;
  store: {
    name: string;
    domain: string;
    myshopifyDomain: string;
    description: string;
    country: string;
    currency: string;
    languages: string[];
    markets: string[];
    theme: {
      name: string;
      version: string;
      themeStoreId: number | null;
      onlineStore2: boolean | null;
    };
    headless: boolean;
    payments: string[];
  };
  plan: {
    verdict: "plus" | "standard" | "unknown";
    confidence: 1 | 2 | 3;
    signals: Array<{ label: string; state: "found" | "absent" | "unknown"; detail: string }>;
  };
  catalogue: {
    products: number;
    variants: number;
    collections: number;
    vendors: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    productTypes: Array<{ name: string; count: number }>;
    priceBuckets: Array<{ label: string; count: number }>;
    topCollections: Array<{ title: string; products: number }>;
    recentProducts: Array<{
      title: string;
      type: string;
      price: number;
      image: string | null;
      added: string;
    }>;
  };
  apps: Array<{ name: string; category: string; evidence: string; scope: AppScope }>;
  storefront: {
    scripts: number;
    thirdPartyHosts: number;
    hosts: Array<{ host: string; kb: number }>;
  };
};

/** The page groups apps under its own, slightly broader headings. */
const pageCategory: Record<AppCategory, string> = {
  reviews: "Reviews and UGC",
  ugc: "Reviews and UGC",
  "email-sms": "Email and SMS",
  subscriptions: "Subscriptions",
  loyalty: "Loyalty and referrals",
  support: "Customer support",
  "page-builders": "Page builders",
  search: "Search and merchandising",
  upsell: "Upsell and bundles",
  analytics: "Analytics and pixels",
  consent: "Consent",
  shipping: "Shipping and returns",
  payments: "Payments and BNPL",
  translation: categoryLabels.translation,
};

const FALLBACK_CURRENCY = "USD";

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 ? 2 : 0,
    })
      .format(value)
      .replace(/^US\$/, "$");
  } catch {
    return String(value);
  }
}

export function bucketLabels(buckets: PriceBucket[], currency: string) {
  return buckets.map((bucket) => ({
    label:
      bucket.from === 0 && bucket.to !== null
        ? `Under ${money(bucket.to, currency)}`
        : bucket.to === null
          ? `${money(bucket.from, currency)}+`
          : `${money(bucket.from, currency)}–${money(bucket.to, currency).replace(/^\D+/, "")}`,
    count: bucket.count,
  }));
}

/** "3 days ago", "2 weeks ago", "5 months ago". */
export function ago(iso: string | null, now: number = Date.now()) {
  const then = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(then)) return "recently";
  const days = Math.max(0, Math.floor((now - then) / 86_400_000));
  if (days < 1) return "today";
  if (days < 14) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 730) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function displayName(type: "region" | "language", code: string | null) {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["en-GB"], { type }).of(code) ?? null;
  } catch {
    return null;
  }
}

/** The store's own name: og:site_name, else the part of the page title before a separator. */
function storeName(analysis: StoreAnalysis) {
  const fromTitle = analysis.title?.split(/\s+[|–—·]\s+|\s+-\s+/)[0]?.trim();
  return analysis.siteName || fromTitle || analysis.host.replace(/^www\./, "");
}

export function toReport(analysis: StoreAnalysis): Report {
  const { products, collections, theme, plan, locale } = analysis;
  const currency = locale.currency ?? FALLBACK_CURRENCY;
  const domain = analysis.host.replace(/^www\./, "");

  // Plan: only evidence we can actually see, weighed lightly; never "standard"
  const score =
    (plan.checkoutHost ? 2 : 0) + (plan.expansionDomains.length ? 1 : 0) + (plan.b2bLink ? 1 : 0);
  const planSignals: Report["plan"]["signals"] = [
    plan.checkoutHost
      ? {
          label: "Checkout on its own subdomain",
          state: "found",
          detail: `Links point to ${plan.checkoutHost}, a checkout on the brand's own domain. Plus stores can run checkout there.`,
        }
      : {
          label: "Checkout on its own subdomain",
          state: "absent",
          detail: "No checkout on the brand's own subdomain is linked from the home page.",
        },
    plan.expansionDomains.length
      ? {
          label: "Expansion stores",
          state: "found",
          detail: `Regional versions on other domains (${plan.expansionDomains.join(", ")}) are linked through hreflang. Expansion stores are a Plus feature, though regional domains can be set up on other plans too.`,
        }
      : {
          label: "Expansion stores",
          state: "absent",
          detail: "No regional versions on separate domains are linked through hreflang.",
        },
    plan.b2bLink
      ? {
          label: "B2B wholesale portal",
          state: "found",
          detail: `A wholesale or trade page is linked from the home page (${plan.b2bLink.slice(0, 80)}). Wholesale portals are often built on Plus, though apps can do the same on other plans.`,
        }
      : {
          label: "B2B wholesale portal",
          state: "absent",
          detail: "No wholesale or trade login is linked from the home page.",
        },
    {
      label: "Checkout extensions",
      state: "unknown",
      detail:
        "Checkout customisation can only be seen inside checkout, which this analysis doesn't enter.",
    },
    {
      label: "Shopify Functions discounts",
      state: "unknown",
      detail:
        "Discount logic runs inside the cart and checkout, which this analysis doesn't enter.",
    },
  ];

  // Product types: the biggest five, the rest folded into "Other"
  const topTypes = products.types.slice(0, 5);
  const otherCount = products.count - topTypes.reduce((sum, type) => sum + type.count, 0);
  const productTypes = [
    ...topTypes,
    ...(otherCount > 0 && topTypes.length > 0 ? [{ name: "Other", count: otherCount }] : []),
  ];
  if (productTypes.length === 0 && products.count > 0) {
    productTypes.push({ name: "No product type", count: products.count });
  }

  return {
    query: domain,
    analysedAt: analysis.analysedAt,
    isShopify: true,
    store: {
      name: storeName(analysis),
      domain,
      myshopifyDomain: analysis.myshopifyDomain ?? "",
      description: analysis.description ?? "",
      country: displayName("region", locale.country) ?? "Not shown",
      currency,
      languages: locale.languages.map((code) => displayName("language", code) ?? code),
      markets: locale.currency ? [locale.currency] : [],
      theme: theme
        ? {
            name: theme.baseName ?? theme.name,
            version: theme.version ?? "",
            themeStoreId: theme.themeStoreId,
            onlineStore2: theme.onlineStore2,
          }
        : { name: "Not shown", version: "", themeStoreId: null, onlineStore2: null },
      headless: analysis.shopify.headless,
      payments: analysis.payments,
    },
    plan: {
      verdict: score >= 2 ? "plus" : "unknown",
      confidence: plan.checkoutHost && score >= 3 ? 3 : score >= 2 ? 2 : 1,
      signals: planSignals,
    },
    catalogue: {
      products: analysis.totals.products ?? products.count,
      // Breakdowns come from up to the first 1,000 products; when the store has more, scale variants to match
      variants:
        analysis.totals.products && analysis.totals.products > products.count && products.count > 0
          ? Math.round((products.variants / products.count) * analysis.totals.products)
          : products.variants,
      collections: analysis.totals.collections ?? collections?.count ?? 0,
      vendors: products.vendors,
      averagePrice: Math.round((products.price?.mean ?? 0) * 100) / 100,
      priceRange: { min: products.price?.min ?? 0, max: products.price?.max ?? 0 },
      productTypes,
      priceBuckets: bucketLabels(products.priceBuckets, currency),
      topCollections: (collections?.top ?? [])
        .slice(0, 8)
        .map((c) => ({ title: c.title, products: c.products })),
      recentProducts: products.newest
        .filter((product) => product.price !== null)
        .slice(0, 6)
        .map((product) => ({
          title: product.title,
          type: product.type ?? "Product",
          price: product.price as number,
          image: product.image,
          added: ago(product.publishedAt),
        })),
    },
    apps: [...analysis.apps]
      .sort(
        (a, b) =>
          categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
          a.name.localeCompare(b.name),
      )
      .map((app) => ({
        name: app.name,
        category: pageCategory[app.category],
        evidence:
          app.confidence === "likely" ? `${app.evidence} (markup only, likely)` : app.evidence,
        scope: app.scope,
      })),
    storefront: {
      scripts: analysis.storefront.scripts,
      thirdPartyHosts: analysis.storefront.thirdPartyHosts,
      hosts: analysis.storefront.hosts,
    },
  };
}
