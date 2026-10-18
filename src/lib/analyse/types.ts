/** Shapes shared by the analysis library, the API routes and the results page. */

export type AppCategory =
  | "reviews"
  | "ugc"
  | "email-sms"
  | "subscriptions"
  | "loyalty"
  | "wishlist"
  | "support"
  | "page-builders"
  | "search"
  | "upsell"
  | "analytics"
  | "consent"
  | "shipping"
  | "payments"
  | "translation";

/** Where an app was seen: "Every page" means both the home page and a product page. */
export type AppScope = "Every page" | "Home page" | "Product pages";

/** "confirmed": the app's own script or domain is loaded. "likely": only markup that resembles it. */
export type Confidence = "confirmed" | "likely";

export type DetectedApp = {
  id: string;
  name: string;
  category: AppCategory;
  confidence: Confidence;
  /** What gave it away, shortened for display. */
  evidence: string;
  scope: AppScope;
};

export type ThemeInfo = {
  /** The merchant's name for the theme, e.g. "Production – Dawn copy". */
  name: string;
  /** The theme's own name when it ships with one, e.g. "Dawn". */
  baseName: string | null;
  version: string | null;
  source: "theme-store" | "custom";
  /** Shopify Theme Store ID, for themes bought there. */
  themeStoreId: number | null;
  /** Online Store 2.0 (JSON templates) or an older theme; null when the pages don't show it. */
  onlineStore2: boolean | null;
};

/**
 * What we saw that only Plus stores usually have. Shopify does not publish a
 * store's plan, so this is evidence, never a verdict.
 */
export type PlanEvidence = {
  /** Checkout served from the brand's own subdomain, e.g. "checkout.brand.com". */
  checkoutHost: string | null;
  /** Other domains the storefront points to as regional versions of itself. */
  expansionDomains: string[];
  /** A wholesale or trade login linked from the home page. */
  b2bLink: string | null;
};

export type ShopifyCheck = {
  isShopify: boolean;
  /** Signals that led to the answer, in plain words. */
  signals: string[];
  /** Hydrogen or another custom front end on top of Shopify. */
  headless: boolean;
  myshopifyDomain: string | null;
};

export type PriceBucket = { from: number; to: number | null; count: number };

export type ProductSummary = {
  count: number;
  /** True when there are more products than we counted. */
  countCapped: boolean;
  variants: number;
  /** Distinct vendors (brands) among the products counted. */
  vendors: number;
  currency: string | null;
  price: { min: number; median: number; mean: number; max: number } | null;
  priceBuckets: PriceBucket[];
  onSale: number;
  availableShare: number | null;
  /** Every product type with its count, largest first. */
  types: Array<{ name: string; count: number }>;
  newest: Array<{
    title: string;
    handle: string;
    type: string | null;
    price: number | null;
    compareAtPrice: number | null;
    image: string | null;
    publishedAt: string | null;
  }>;
};

export type CollectionSummary = {
  count: number;
  countCapped: boolean;
  top: Array<{ title: string; handle: string; products: number }>;
};

/** What the home page loads from outside the store, by host. */
export type StorefrontWeight = {
  /** <script> tags on the home page. */
  scripts: number;
  /** Distinct hosts that are neither the store nor Shopify. */
  thirdPartyHosts: number;
  /** The busiest hosts, with the transfer size of their main script in KB. */
  hosts: Array<{ host: string; kb: number }>;
};

export type StoreAnalysis = {
  /** Normalised address that was analysed, e.g. "https://www.allbirds.com". */
  url: string;
  host: string;
  analysedAt: string;
  title: string | null;
  /** The store's own name for itself (og:site_name, or the page title). */
  siteName: string | null;
  description: string | null;
  shopify: ShopifyCheck;
  myshopifyDomain: string | null;
  theme: ThemeInfo | null;
  plan: PlanEvidence;
  locale: {
    currency: string | null;
    /** Two-letter country code from Shopify, e.g. "GB". */
    country: string | null;
    /** Language codes the storefront offers, e.g. ["en", "fr"]. */
    languages: string[];
  };
  payments: string[];
  storefront: StorefrontWeight;
  products: ProductSummary;
  /** The store's own totals from /meta.json, which can exceed what we counted. */
  totals: { products: number | null; collections: number | null };
  collections: CollectionSummary | null;
  apps: DetectedApp[];
  /** Pages the app detection looked at. */
  pagesScanned: string[];
  /** Things we could not read, so the page can say so instead of showing blanks. */
  notes: string[];
};

export type CheckResult =
  | { ok: true; host: string; url: string; shopify: ShopifyCheck }
  | {
      ok: false;
      reason: "invalid-url" | "unreachable" | "not-shopify";
      message: string;
      host?: string;
    };
