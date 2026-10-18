import { describe, expect, it } from "vitest";
import { compare } from "./compare";
import type { Report } from "./report";

function store(name: string, apps: Report["apps"] = [], kb = 100): Report {
  return {
    query: `${name}.test`,
    analysedAt: "2026-10-18T10:00:00Z",
    isShopify: true,
    store: {
      name,
      domain: `${name}.test`,
      myshopifyDomain: `${name}.myshopify.com`,
      description: "",
      country: "United Kingdom",
      currency: "GBP",
      languages: ["English"],
      markets: ["GBP"],
      theme: { name: "Dawn", version: "1", themeStoreId: null, onlineStore2: true },
      headless: false,
      payments: ["Shop Pay"],
    },
    plan: { verdict: "unknown", confidence: 1, signals: [] },
    catalogue: {
      products: 100,
      variants: 200,
      collections: 10,
      vendors: 1,
      averagePrice: 40,
      priceRange: { min: 5, max: 90 },
      productTypes: [],
      priceBuckets: [],
      topCollections: [],
      recentProducts: [],
    },
    apps,
    storefront: { scripts: 10, thirdPartyHosts: 1, hosts: [{ host: "x.test", kb }] },
  };
}
const app = (name: string, category: string): Report["apps"][number] => ({
  name,
  category,
  evidence: `${name}.test`,
  scope: "Every page",
});

describe("compare", () => {
  it("suggests Membership when only the competitor has retention apps", () => {
    const result = compare(store("you"), store("them", [app("Recharge", "Subscriptions")]));
    expect(result.suggestions.map((s) => s.id)).toContain("membership");
    expect(result.suggestions[0].reason).toContain("Recharge");
  });

  it("does not suggest a product the visitor already covers", () => {
    const apps = [app("Gorgias", "Customer support")];
    const result = compare(store("you", apps), store("them", apps));
    expect(result.suggestions.map((s) => s.id)).not.toContain("assistant");
  });

  it("suggests the assistant, favourites and gifts from the matching gaps", () => {
    const them = store("them", [
      app("Gorgias", "Customer support"),
      app("Swym Wishlist", "Wishlists and favourites"),
      app("Rebuy", "Upsell and bundles"),
    ]);
    const ids = compare(store("you"), them).suggestions.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["assistant", "favourites", "gifts"]));
  });

  it("flags heavy scripts and keeps the custom-app card last", () => {
    const result = compare(store("you", [], 400), store("them", [], 100));
    const last = result.suggestions.at(-1)!;
    expect(last.id).toBe("custom");
    expect(last.title).toBe("Lighter pages");
  });

  it("always ends with a custom-app card, even with no gaps", () => {
    const result = compare(store("you"), store("them"));
    expect(result.suggestions).toHaveLength(1);
    expect(result.suggestions[0].id).toBe("custom");
  });

  it("splits apps into only-you, only-them and both", () => {
    const result = compare(
      store("you", [app("Klaviyo", "Email and SMS"), app("Okendo", "Reviews and UGC")]),
      store("them", [app("Klaviyo", "Email and SMS"), app("Rebuy", "Upsell and bundles")]),
    );
    expect(result.apps.both.map((a) => a.name)).toEqual(["Klaviyo"]);
    expect(result.apps.onlyYou.map((a) => a.name)).toEqual(["Okendo"]);
    expect(result.apps.onlyThem.map((a) => a.name)).toEqual(["Rebuy"]);
  });

  it("leaves out script weight when neither store could be sized", () => {
    const rows = compare(store("you", [], 0), store("them", [], 0)).rows;
    expect(rows.some((r) => r.label.includes("script"))).toBe(false);
  });

  it("says which store is lighter and ignores near-ties", () => {
    const weight = (a: number, b: number) =>
      compare(store("you", [], a), store("them", [], b)).rows.find((r) => r.label.includes("script"))!.lead;
    expect(weight(100, 300)).toBe("you");
    expect(weight(300, 100)).toBe("them");
    expect(weight(100, 105)).toBeNull();
  });
});
