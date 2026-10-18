import { describe, expect, it } from "vitest";
import { summariseCollections, summariseProducts } from "./catalog";

const product = (overrides: object) => ({
  title: "Item",
  handle: "item",
  vendor: "Fern",
  product_type: "Plant",
  published_at: "2026-01-01T00:00:00Z",
  variants: [{ price: "20.00", compare_at_price: null, available: true }],
  images: [{ src: "https://cdn.shopify.com/s/files/1/a.jpg?v=1" }],
  ...overrides,
});

describe("summariseProducts", () => {
  const summary = summariseProducts(
    [
      product({ title: "A", handle: "a", published_at: "2026-03-01T00:00:00Z" }),
      product({
        title: "B",
        handle: "b",
        published_at: "2026-05-01T00:00:00Z",
        variants: [
          { price: "30.00", compare_at_price: "40.00", available: false },
          { price: "35.00", compare_at_price: null, available: false },
        ],
        images: [{ src: "https://evil.example/x.jpg" }],
      }),
      product({
        title: "C",
        handle: "c",
        vendor: "Other",
        product_type: "",
        variants: [{ price: "10.00", available: true }],
      }),
    ],
    false,
    "GBP",
  );

  it("counts, prices and flags sales", () => {
    expect(summary.count).toBe(3);
    expect(summary.price).toEqual({ min: 10, median: 20, mean: 20, max: 30 });
    expect(summary.onSale).toBe(1);
    expect(summary.availableShare).toBeCloseTo(2 / 3);
  });

  it("counts variants and distinct vendors, ranks types and skips empty ones", () => {
    expect(summary.variants).toBe(4);
    expect(summary.vendors).toBe(2);
    expect(summary.price?.mean).toBeCloseTo(20);
    expect(summary.types).toEqual([{ name: "Plant", count: 2 }]);
  });

  it("lists newest first with the cheapest variant, and only shows Shopify-hosted images", () => {
    expect(summary.newest.map((item) => item.handle)).toEqual(["b", "a", "c"]);
    expect(summary.newest[0]).toMatchObject({ price: 30, compareAtPrice: 40, image: null });
    expect(summary.newest[1].image).toContain("cdn.shopify.com");
    expect(summary.newest[1].image).toContain("width=480");
  });

  it("copes with no products", () => {
    const empty = summariseProducts([], false, null);
    expect(empty).toMatchObject({ count: 0, price: null, availableShare: null, newest: [] });
  });
});

describe("summariseCollections", () => {
  it("sorts by size and returns null when the feed is off", () => {
    const result = summariseCollections({
      collections: [
        { title: "Small", handle: "small", products_count: 2 },
        { title: "Big", handle: "big", products_count: 90 },
        { handle: "no-title" },
      ],
    });
    expect(result?.count).toBe(2);
    expect(result?.top[0]).toEqual({ title: "Big", handle: "big", products: 90 });
    expect(summariseCollections(null)).toBeNull();
  });
});
