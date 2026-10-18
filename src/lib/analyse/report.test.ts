import { describe, expect, it } from "vitest";
import { ago, bucketLabels, toReport } from "./report";
import type { StoreAnalysis } from "./types";

const base: StoreAnalysis = {
  url: "https://www.fern.co",
  host: "www.fern.co",
  analysedAt: "2026-10-17T12:00:00.000Z",
  title: "Fern & Co | Plants, delivered",
  siteName: null,
  description: "Plants, delivered.",
  shopify: {
    isShopify: true,
    signals: ["x"],
    headless: false,
    myshopifyDomain: "fern-co.myshopify.com",
  },
  myshopifyDomain: "fern-co.myshopify.com",
  theme: {
    name: "Fern live",
    baseName: "Dawn",
    version: "15.2.0",
    source: "theme-store",
    themeStoreId: 887,
    onlineStore2: true,
  },
  plan: { checkoutHost: null, expansionDomains: [], b2bLink: null },
  locale: { currency: "GBP", country: "GB", languages: ["en", "fr"] },
  payments: ["Shop Pay"],
  storefront: { scripts: 40, thirdPartyHosts: 6, hosts: [{ host: "static.klaviyo.com", kb: 90 }] },
  products: {
    count: 100,
    countCapped: false,
    variants: 240,
    vendors: 3,
    currency: "GBP",
    price: { min: 6, median: 40, mean: 64.256, max: 420 },
    priceBuckets: [
      { from: 0, to: 25, count: 20 },
      { from: 25, to: 50, count: 40 },
      { from: 50, to: null, count: 40 },
    ],
    onSale: 10,
    availableShare: 0.9,
    types: [
      { name: "A", count: 30 },
      { name: "B", count: 20 },
      { name: "C", count: 10 },
      { name: "D", count: 8 },
      { name: "E", count: 6 },
      { name: "F", count: 5 },
    ],
    newest: [
      {
        title: "Mug",
        handle: "mug",
        type: null,
        price: 28,
        compareAtPrice: null,
        image: null,
        publishedAt: "2026-10-14T00:00:00Z",
      },
      {
        title: "No price",
        handle: "np",
        type: "X",
        price: null,
        compareAtPrice: null,
        image: null,
        publishedAt: null,
      },
    ],
  },
  totals: { products: null, collections: null },
  collections: {
    count: 12,
    countCapped: false,
    top: [{ title: "New in", handle: "new", products: 30 }],
  },
  apps: [
    {
      id: "klaviyo",
      name: "Klaviyo",
      category: "email-sms",
      confidence: "confirmed",
      evidence: "static.klaviyo.com/x.js",
      scope: "Every page",
    },
    {
      id: "judgeme",
      name: "Judge.me",
      category: "reviews",
      confidence: "likely",
      evidence: "“jdgm-” markup",
      scope: "Product pages",
    },
    {
      id: "okendo",
      name: "Okendo",
      category: "ugc",
      confidence: "confirmed",
      evidence: "okendo.io",
      scope: "Home page",
    },
  ],
  pagesScanned: ["/", "/products/mug"],
  notes: [],
};

describe("toReport", () => {
  const report = toReport(base);

  it("fills the store profile", () => {
    expect(report.query).toBe("fern.co");
    expect(report.store).toMatchObject({
      name: "Fern & Co",
      domain: "fern.co",
      country: "United Kingdom",
      currency: "GBP",
      languages: ["English", "French"],
      markets: ["GBP"],
      payments: ["Shop Pay"],
      headless: false,
      theme: { name: "Dawn", version: "15.2.0", themeStoreId: 887, onlineStore2: true },
    });
  });

  it("uses the store's own totals, and scales variants when only part of the catalogue was read", () => {
    const big = toReport({ ...base, totals: { products: 1000, collections: 40 } }).catalogue;
    expect(big).toMatchObject({ products: 1000, collections: 40, variants: 2400 });
    expect(
      toReport({ ...base, totals: { products: 100, collections: null } }).catalogue,
    ).toMatchObject({ products: 100, collections: 12, variants: 240 });
  });

  it("prefers the store's own name when it gives one", () => {
    expect(toReport({ ...base, siteName: "Fern" }).store.name).toBe("Fern");
  });

  it("summarises the catalogue with the five biggest types and an Other row", () => {
    expect(report.catalogue).toMatchObject({
      products: 100,
      variants: 240,
      collections: 12,
      vendors: 3,
      averagePrice: 64.26,
    });
    expect(report.catalogue.priceRange).toEqual({ min: 6, max: 420 });
    expect(report.catalogue.productTypes.map((t) => t.name)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "Other",
    ]);
    expect(report.catalogue.productTypes.at(-1)?.count).toBe(26);
  });

  it("labels price bands in the store's currency", () => {
    expect(report.catalogue.priceBuckets.map((b) => b.label)).toEqual([
      "Under £25",
      "£25–50",
      "£50+",
    ]);
    expect(bucketLabels([{ from: 0, to: 10, count: 1 }], "USD")[0].label).toBe("Under $10");
  });

  it("lists recent products that have a price, with a relative date and a fallback type", () => {
    expect(report.catalogue.recentProducts).toEqual([
      {
        title: "Mug",
        type: "Product",
        price: 28,
        image: null,
        added: expect.stringMatching(/ago|today/),
      },
    ]);
  });

  it("groups apps under the page's headings in a fixed order and flags likely ones", () => {
    expect(report.apps.map((app) => [app.name, app.category])).toEqual([
      ["Judge.me", "Reviews and UGC"],
      ["Okendo", "Reviews and UGC"],
      ["Klaviyo", "Email and SMS"],
    ]);
    expect(report.apps[0].evidence).toContain("likely");
    expect(report.apps[2].scope).toBe("Every page");
  });

  it("never claims a standard plan, and only says Plus with real evidence", () => {
    expect(report.plan.verdict).toBe("unknown");
    expect(report.plan.confidence).toBe(1);
    expect(report.plan.signals.map((s) => s.state)).toEqual([
      "absent",
      "absent",
      "absent",
      "unknown",
      "unknown",
    ]);

    const plus = toReport({
      ...base,
      plan: {
        checkoutHost: "checkout.fern.co",
        expansionDomains: ["fern.de"],
        b2bLink: "/pages/wholesale",
      },
    }).plan;
    expect(plus.verdict).toBe("plus");
    expect(plus.confidence).toBe(3);

    expect(
      toReport({
        ...base,
        plan: { checkoutHost: null, expansionDomains: ["fern.de"], b2bLink: null },
      }).plan.verdict,
    ).toBe("unknown");
    expect(
      toReport({
        ...base,
        plan: { checkoutHost: "checkout.fern.co", expansionDomains: [], b2bLink: null },
      }).plan,
    ).toMatchObject({ verdict: "plus", confidence: 2 });
  });

  it("copes with a store that prints no theme, currency or collections", () => {
    const sparse = toReport({
      ...base,
      theme: null,
      collections: null,
      locale: { currency: null, country: null, languages: [] },
    });
    expect(sparse.store.theme).toEqual({
      name: "Not shown",
      version: "",
      themeStoreId: null,
      onlineStore2: null,
    });
    expect(sparse.store.currency).toBe("USD");
    expect(sparse.store.markets).toEqual([]);
    expect(sparse.store.country).toBe("Not shown");
    expect(sparse.catalogue.collections).toBe(0);
    expect(sparse.catalogue.topCollections).toEqual([]);
  });
});

describe("ago", () => {
  const now = Date.parse("2026-10-17T12:00:00Z");
  it("reads naturally at each scale", () => {
    expect(ago("2026-10-17T01:00:00Z", now)).toBe("today");
    expect(ago("2026-10-16T01:00:00Z", now)).toBe("1 day ago");
    expect(ago("2026-10-10T00:00:00Z", now)).toBe("7 days ago");
    expect(ago("2026-09-26T00:00:00Z", now)).toBe("3 weeks ago");
    expect(ago("2026-05-01T00:00:00Z", now)).toBe("5 months ago");
    expect(ago("2023-01-01T00:00:00Z", now)).toBe("3 years ago");
    expect(ago(null, now)).toBe("recently");
  });
});
