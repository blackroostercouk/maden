import { beforeEach, describe, expect, it, vi } from "vitest";

const analyseStore = vi.fn();
vi.mock("@/lib/analyse/analyse", () => ({ analyseStore }));

const analysis = {
  url: "https://x.com",
  host: "www.x.com",
  analysedAt: "2026-10-17T12:00:00.000Z",
  title: "X | Shop",
  siteName: null,
  description: null,
  shopify: { isShopify: true, signals: [], headless: false, myshopifyDomain: null },
  myshopifyDomain: "x.myshopify.com",
  theme: null,
  plan: { checkoutHost: null, expansionDomains: [], b2bLink: null },
  locale: { currency: "GBP", country: "GB", languages: ["en"] },
  payments: [],
  storefront: { scripts: 3, thirdPartyHosts: 0, hosts: [] },
  products: {
    count: 1,
    countCapped: false,
    variants: 1,
    vendors: 1,
    currency: "GBP",
    price: { min: 5, median: 5, mean: 5, max: 5 },
    priceBuckets: [{ from: 0, to: null, count: 1 }],
    onSale: 0,
    availableShare: 1,
    types: [],
    newest: [],
  },
  totals: { products: null, collections: null },
  collections: null,
  apps: [],
  pagesScanned: ["/"],
  notes: [],
};

let ip = 0;
function post(body: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request("http://moden.test/api/analyse", {
    method: "POST",
    headers: {
      host: "moden.test",
      origin: "http://moden.test",
      "content-type": "application/json",
      "x-forwarded-for": `10.1.0.${ip}`,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function load() {
  vi.resetModules();
  return import("./route");
}

beforeEach(() => {
  analyseStore.mockReset().mockResolvedValue({ ok: true, analysis });
});

describe("POST /api/analyse", () => {
  it("returns the report the page renders", async () => {
    const { POST } = await load();
    const response = await POST(post({ url: "x.com" }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.report.query).toBe("x.com");
    expect(analyseStore.mock.calls[0][0]).toBe("x.com");
  });

  it("answers failures with the page's notice codes", async () => {
    const { POST } = await load();
    const cases = [
      ["invalid-url", "invalid"],
      ["not-shopify", "not-shopify"],
      ["unreachable", "unreachable"],
      ["blocked", "blocked"],
    ] as const;
    for (const [reason, code] of cases) {
      analyseStore.mockResolvedValueOnce({ ok: false, reason });
      expect(await (await POST(post({ url: "x.com" }))).json()).toEqual({ ok: false, code });
    }
  });

  it("rejects other sites, non-JSON, bad bodies and missing addresses", async () => {
    const { POST } = await load();
    expect((await POST(post({ url: "x.com" }, { origin: "https://evil.test" }))).status).toBe(403);
    expect((await POST(post({ url: "x.com" }, { "content-type": "text/plain" }))).status).toBe(415);
    expect((await POST(post("{oops"))).status).toBe(400);
    expect((await POST(post({ url: 42 }))).status).toBe(400);
    expect((await POST(post({ url: "x".repeat(5000) }))).status).toBe(413);
  });

  it("limits repeated requests from one address", async () => {
    const { POST } = await load();
    const headers = { "x-forwarded-for": "10.9.9.9" };
    let last = 200;
    for (let i = 0; i < 14; i++) last = (await POST(post({ url: "x.com" }, headers))).status;
    expect(last).toBe(429);
  });
});
