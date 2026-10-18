import { describe, expect, it } from "vitest";
import { detectApps } from "./apps";
import { readLanguages, readPage, readShop, readTheme } from "./html";
import { detectPlan, detectShopify } from "./shopify";
import { parseMeta } from "./meta";
import { detectPayments } from "./payments";

const storefront = `<!doctype html><html><head><title>Fern &amp; Co</title>
<meta name="description" content="Plants, &quot;delivered&quot;.">
<script>var Shopify = Shopify || {};
Shopify.shop = "fern-co.myshopify.com";
Shopify.locale = "en";
Shopify.currency = {"active":"GBP","rate":"1.0"};
Shopify.country = "GB";
Shopify.theme = {"name":"Fern live {v2}","id":1,"schema_name":"Dawn","schema_version":"15.2.0","theme_store_id":887,"role":"main"};</script>
<script src="https://cdn.judge.me/widget.js"></script>
<script src="//static.klaviyo.com/onsite/js/klaviyo.js"></script>
<link rel="canonical" href="https://www.trustpilot.com/fern">
</head><body class="jdgm-widget"><a href="https://checkout.fern.co/cart">Checkout</a>
<div class="yotpo-main-widget"></div>
<a href="https://www.loox.io.example.com/">not loox</a>
<p>We love notjudge.me but not as a script.</p></body></html>`;

describe("readPage / readTheme / readShop", () => {
  const page = readPage(storefront);

  it("reads title and description with entities decoded", () => {
    expect(page.title).toBe("Fern & Co");
    expect(page.description).toBe('Plants, "delivered".');
  });

  it("collects loaded resources but not canonical links", () => {
    expect(page.resources).toContain("https://cdn.judge.me/widget.js");
    expect(page.resources.some((resource) => resource.includes("trustpilot"))).toBe(false);
  });

  it("reads the theme, including braces inside its name", () => {
    expect(readTheme(storefront)).toEqual({
      name: "Fern live {v2}",
      baseName: "Dawn",
      version: "15.2.0",
      source: "theme-store",
      themeStoreId: 887,
      onlineStore2: null,
    });
  });

  it("calls a theme without a store ID custom, and returns null when there is none", () => {
    expect(readTheme('Shopify.theme = {"name":"Mine","theme_store_id":null};')?.source).toBe(
      "custom",
    );
    expect(readTheme("<html></html>")).toBeNull();
  });

  it("reads currency, country, language and the myshopify domain", () => {
    expect(readShop(storefront)).toEqual({
      myshopifyDomain: "fern-co.myshopify.com",
      currency: "GBP",
      country: "GB",
      language: "en",
    });
  });
});

describe("detectApps", () => {
  const apps = detectApps([{ page: readPage(storefront), kind: "home" }]);
  const byId = (id: string) => apps.find((app) => app.id === id);

  it("confirms apps whose own scripts load", () => {
    expect(byId("judgeme")?.confidence).toBe("confirmed");
    expect(byId("klaviyo")?.confidence).toBe("confirmed");
  });

  it("marks markup-only matches as likely", () => {
    expect(byId("yotpo")?.confidence).toBe("likely");
  });

  it("ignores look-alike hostnames, plain links and text mentions", () => {
    expect(byId("loox")).toBeUndefined();
    expect(byId("trustpilot")).toBeUndefined();
  });

  it("keeps the strongest evidence across pages and lists each app once", () => {
    const merged = detectApps([
      { page: readPage('<div class="yotpo-widget"></div>'), kind: "home" },
      {
        page: readPage('<script src="https://staticw2.yotpo.com/x.js"></script>'),
        kind: "product",
      },
    ]);
    expect(merged.filter((app) => app.id === "yotpo")).toHaveLength(1);
    expect(merged[0].confidence).toBe("confirmed");
  });
});

describe("detectShopify", () => {
  it("recognises a classic storefront from its headers and scripts", () => {
    const result = detectShopify({
      headers: { "powered-by": "Shopify" },
      html: storefront,
      productsFeed: true,
    });
    expect(result.isShopify).toBe(true);
    expect(result.headless).toBe(false);
    expect(result.myshopifyDomain).toBe("fern-co.myshopify.com");
  });

  it("recognises a custom front end from its Shopify domain and assets", () => {
    const html =
      `<img src="https://cdn.shopify.com/s/files/1/a.jpg">`.repeat(5) + "kotn-ss15.myshopify.com";
    const result = detectShopify({ headers: {}, html, productsFeed: false });
    expect(result.isShopify).toBe(true);
    expect(result.headless).toBe(true);
  });

  it("says no for a site with no Shopify tells, even if it embeds one Shopify image", () => {
    const html = `<img src="https://cdn.shopify.com/s/files/1/a.jpg"><title>Blog</title>`;
    expect(
      detectShopify({ headers: { server: "nginx" }, html, productsFeed: false }).isShopify,
    ).toBe(false);
  });
});

describe("detectApps scope", () => {
  const home = readPage(
    '<script src="https://static.klaviyo.com/a.js"></script><script src="https://js.smile.io/b.js"></script>',
  );
  const product = readPage(
    '<script src="https://static.klaviyo.com/a.js"></script><script src="https://cdn.judge.me/c.js"></script>',
  );
  const apps = detectApps([
    { page: home, kind: "home" },
    { page: product, kind: "product" },
  ]);
  const scope = (id: string) => apps.find((app) => app.id === id)?.scope;

  it("says where each app was seen", () => {
    expect(scope("klaviyo")).toBe("Every page");
    expect(scope("smile")).toBe("Home page");
    expect(scope("judgeme")).toBe("Product pages");
  });
});

describe("detectPlan", () => {
  it("finds a checkout on the brand's own subdomain", () => {
    expect(detectPlan("www.fern.co", readPage(storefront)).checkoutHost).toBe("checkout.fern.co");
  });

  it("finds regional versions on other domains, not on the same site", () => {
    const page = readPage(
      '<link rel="alternate" hreflang="en-gb" href="https://www.fern.co/"><link rel="alternate" hreflang="fr" href="https://www.fern.co/fr/"><link rel="alternate" hreflang="de" href="https://fern.de/">',
    );
    expect(detectPlan("www.fern.co", page).expansionDomains).toEqual(["fern.de"]);
  });

  it("finds a wholesale link on the same site only", () => {
    const page = readPage(
      '<a href="/pages/wholesale-login">Trade</a><a href="https://other.com/wholesale">x</a>',
    );
    expect(detectPlan("fern.co", page).b2bLink).toBe("/pages/wholesale-login");
  });

  it("reports nothing when there is nothing to go on", () => {
    expect(detectPlan("www.fern.co", readPage("<html></html>"))).toEqual({
      checkoutHost: null,
      expansionDomains: [],
      b2bLink: null,
    });
  });
});

describe("readLanguages, payments and storefront markup", () => {
  it("lists language codes once, from hreflang and the current language", () => {
    const page = readPage(
      '<link rel="alternate" hreflang="en-GB" href="x"><link rel="alternate" hreflang="en-US" href="y"><link rel="alternate" hreflang="fr" href="z"><link rel="alternate" hreflang="x-default" href="w">',
    );
    expect(readLanguages(page, "en")).toEqual(["en", "fr"]);
  });

  it("recognises payment methods from their buttons and scripts", () => {
    const page = readPage(
      '<div class="shopify-payment-button"></div><script src="https://www.paypal.com/sdk/js"></script><script src="https://js.klarna.com/x.js"></script>',
    );
    expect(detectPayments([page])).toEqual(["Shop Pay", "PayPal", "Klarna"]);
  });

  it("tells Online Store 2.0 themes from older ones", () => {
    expect(
      readTheme('Shopify.theme = {"name":"A"}; <div id="shopify-section-template--123__hero">')
        ?.onlineStore2,
    ).toBe(true);
    expect(
      readTheme('Shopify.theme = {"name":"A"}; <div id="shopify-section-header">')?.onlineStore2,
    ).toBe(false);
    expect(readTheme('Shopify.theme = {"name":"A"};')?.onlineStore2).toBeNull();
  });
});

describe("parseMeta", () => {
  const raw = {
    name: "Kylie Cosmetics",
    country: "US",
    currency: "usd",
    description: "Makeup",
    myshopify_domain: "kylie-jenner-us.myshopify.com",
    domain: "KyLieCosmetics.com",
    published_products_count: 244,
    published_collections_count: 227,
  };

  it("reads the store's own profile", () => {
    expect(parseMeta(raw)).toEqual({
      name: "Kylie Cosmetics",
      country: "US",
      currency: "USD",
      description: "Makeup",
      myshopifyDomain: "kylie-jenner-us.myshopify.com",
      domain: "kyliecosmetics.com",
      productsCount: 244,
      collectionsCount: 227,
    });
  });

  it("refuses anything that is not a Shopify profile", () => {
    expect(parseMeta(null)).toBeNull();
    expect(parseMeta("<html>")).toBeNull();
    expect(parseMeta({ name: "x", myshopify_domain: "evil.example.com" })).toBeNull();
    expect(
      parseMeta({ ...raw, currency: "not-a-currency", published_products_count: -1 }),
    ).toMatchObject({
      currency: null,
      productsCount: null,
    });
  });
});

describe("detectPlan with the store's primary domain", () => {
  it("treats a primary domain on a checkout subdomain as Plus evidence", () => {
    const page = readPage("<html></html>");
    expect(detectPlan("gymshark.com", page, "us.checkout.gymshark.com").checkoutHost).toBe(
      "us.checkout.gymshark.com",
    );
    expect(detectPlan("gymshark.com", page, "gymshark.com").checkoutHost).toBeNull();
    expect(detectPlan("gymshark.com", page, "checkout.other.com").checkoutHost).toBeNull();
  });
});
