/**
 * Copy for the landing pages under /custom-apps/[slug], in British English.
 * One entry per kind of commission. The illustrations and photographs that go
 * with each page live in src/components/landing, keyed by the same slug.
 */
import type { Plan, Principle, Service } from "@/components/blocks";
import type { CheckItem, HeadingLine } from "@/components/ui";

export type LandingFaq = { question: string; answer: string };

export type Landing = {
  slug: string;
  /** Short name used in the page title and structured data. */
  name: string;
  metaTitle: string;
  metaDescription: string;
  /** Pre-ticked area in the enquiry form. Must match an entry in enquiry.areas. */
  enquiryArea: string;
  hero: {
    eyebrow: string;
    titleLines: HeadingLine[];
    lede: string;
    cta: string;
    imageAlt: string;
  };
  problem: { eyebrow: string; title: string; intro: string; items: Principle[] };
  /** One line over a full-width photograph, for pages whose recipe has a band. */
  band?: { eyebrow: string; title: string };
  /** Heading and captions for pages whose recipe has a gallery. */
  gallery?: { eyebrow: string; title: string; intro: string; captions: string[] };
  build: { eyebrow: string; title: string; intro: string; items: Service[] };
  example: {
    eyebrow: string;
    title: string;
    text: string;
    checks: CheckItem[];
    sceneLabel: string;
  };
  plans: { eyebrow: string; title: string; intro: string; items: Plan[] };
  faq: LandingFaq[];
};

export const landingSlugs = [
  "pricing-and-discounts",
  "checkout-customisation",
  "erp-and-warehouse-integrations",
  "b2b-and-wholesale",
  "product-configurators",
  "membership-and-subscriptions",
] as const;

export type LandingSlug = (typeof landingSlugs)[number];

export const landingCopy = {
  problemEyebrow: "Where off-the-shelf stops",
  buildEyebrow: "What we build",
  planEyebrow: "Plus and other plans",
  faqEyebrow: "Questions",
  faqTitle: "Before we speak.",
  exampleEyebrow: "Example",
  secondaryCta: "How a commission works",
  ctaBandTitle: "Tell us the one thing your store can't do yet.",
} as const;

export const landings: Record<LandingSlug, Landing> = {
  /* ------------------------------------------------ Pricing and discounts */
  "pricing-and-discounts": {
    slug: "pricing-and-discounts",
    name: "Pricing and discount apps",
    metaTitle: "Custom Shopify Pricing and Discount Apps",
    metaDescription:
      "Tiered, trade, member and conditional pricing built as a private Shopify app that runs on Shopify Functions. Fixed price, and the code is yours.",
    enquiryArea: "Discounts and pricing",
    hero: {
      eyebrow: "Pricing and discounts",
      titleLines: [
        { text: "Pricing rules" },
        { text: "no app lets you write.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Tiered prices, trade terms, member rates, bundles that depend on the basket. If your pricing is more specific than a discount code, we build it as a private Shopify app that runs inside Shopify at checkout speed.",
      cta: "Tell us your pricing rule",
      imageAlt:
        "A folded sage-green wool jumper with a handwritten price tag beside a ledger and a brass calculator under a desk lamp.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "A discount code can't think.",
      intro:
        "Public discount apps cover the common cases. Pricing gets expensive when your rules are the thing that makes your business different.",
      items: [
        {
          title: "Rules that stack in the wrong order.",
          text: "Two apps each apply their own discount, the basket lands on a price nobody chose, and support spends the afternoon explaining it.",
        },
        {
          title: "Logic that can't see your data.",
          text: "Prices that depend on a customer's account, order history or a stock level need a rule that can read them, not another coupon.",
        },
        {
          title: "A rule nobody owns.",
          text: "When the logic lives in a third party's settings, nobody on your team can say exactly what it does or change it safely.",
        },
      ],
    },
    band: {
      eyebrow: "Pricing logic",
      title: "Every price has a reason. We write it down.",
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "Pricing logic, written for your store.",
      intro:
        "Rules are written as Shopify Functions, so they run inside Shopify rather than on someone else's server.",
      items: [
        {
          title: "Tiered and volume pricing",
          text: "Price breaks by quantity, value or product mix, shown on the product page and applied in the basket.",
          plans: "All plans",
        },
        {
          title: "Customer and member rates",
          text: "Prices that follow a customer's tag, segment or membership, with the saving shown before checkout.",
          plans: "All plans",
        },
        {
          title: "Bundles and conditional discounts",
          text: "Offers that depend on what else is in the basket, written once and tested against every combination.",
          plans: "Plus for custom apps",
          plusOnly: true,
        },
        {
          title: "Rules fed by your own data",
          text: "Prices from your ERP, margin floors and price lists feeding the rule directly.",
          plans: "Plus",
          plusOnly: true,
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "A trade price, applied before the shopper sees a surprise.",
      text: "A 24-piece order from a trade customer crosses the 10-unit tier. The rule applies the trade price in the basket, shows the saving and leaves everything else alone.",
      checks: [
        {
          title: "Written in your own code,",
          text: "not in a third party's settings.",
        },
        { title: "Previewed", text: "against a real basket before it goes live." },
        { title: "Logged,", text: "so support can explain any price in seconds." },
      ],
      sceneLabel:
        "Example pricing rule: a trade customer's 24 mugs at £28 cross the 10-unit tier and receive 8% off, taking the total to £618.24.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "Pricing on Plus, and on every other plan.",
      intro:
        "What we can build depends on your plan. We tell you what is possible on the first call.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "Private Shopify Functions.",
              text: "Discount, cart-validation and delivery rules written for your store only.",
            },
            {
              title: "Your data in the rule.",
              text: "ERP prices, margin floors and customer attributes feed the logic directly.",
            },
            {
              title: "Rules per market.",
              text: "Different logic for your UK, EU and US storefronts.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Shopify and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Automatic discounts",
              text: "built around customer segments and tags, with stacking set up properly.",
            },
            {
              title: "A public-app route",
              text: "when you need real Functions logic: shipped as a public app, which works on most plans.",
            },
            {
              title: "Messaging that matches",
              text: "storefront price notes that always agree with what the basket charges.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can this run on a plan other than Plus?",
        answer:
          "Often, yes. Custom Shopify Functions need Plus, but many pricing rules can be built with automatic discounts and customer segments, or shipped as a public app that works on most plans. We tell you which route fits on the first call.",
      },
      {
        question: "Will it clash with the discount apps we already use?",
        answer:
          "We map every active discount first and design the new rule to sit alongside them, or to replace the ones it makes redundant. Stacking order is tested before launch.",
      },
      {
        question: "How are prices kept consistent across currencies?",
        answer:
          "Rules are written against Shopify's market prices, so a rule that gives 8% off does so in pounds, euros and dollars alike. Fixed prices per market are supported where you need them.",
      },
      {
        question: "What does it cost?",
        answer:
          "A fixed price, agreed once the scope is written down at the specification stage. If hosting is needed it runs on your own accounts, at cost.",
      },
    ],
  },

  /* ---------------------------------------------------------- Checkout */
  "checkout-customisation": {
    slug: "checkout-customisation",
    name: "Checkout extensions",
    metaTitle: "Custom Shopify Checkout Extensions and Rules",
    metaDescription:
      "Delivery days, custom fields, validation and trust content built into your Shopify checkout as a private app. Fixed price, and the code is yours.",
    enquiryArea: "Checkout",
    hero: {
      eyebrow: "Checkout",
      titleLines: [
        { text: "A checkout built around" },
        { text: "how you really sell.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Delivery days, gift options, custom fields, validation and trust content, placed exactly where the shopper decides. We build the extensions and the rules behind them as one private app.",
      cta: "Tell us what your checkout needs",
      imageAlt:
        "A customer's hands holding a phone to a card reader beside a kraft-wrapped parcel with a handwritten gift note, mugs on shelves behind.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "The default checkout can't know your business.",
      intro:
        "It is built to convert the average store. The moment you sell something unusual, it needs to ask a different question.",
      items: [
        {
          title: "Information you can't collect.",
          text: "A delivery day, a gift note, a VAT number or a nominated warehouse has nowhere to go, so it ends up in emails and spreadsheets.",
        },
        {
          title: "Rules enforced too late.",
          text: "A postcode you can't deliver to, or items that can't ship together, are found after payment instead of before it.",
        },
        {
          title: "Reassurance in the wrong place.",
          text: "Returns, delivery promises and trust content sit on other pages while shoppers hesitate at the last step.",
        },
      ],
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "Checkout extensions, built for your store.",
      intro: "Each piece is a small extension with one job, built to match your brand.",
      items: [
        {
          title: "Custom fields and notes",
          text: "Delivery notes, gift messages, VAT numbers and instructions, saved to the order.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Delivery options and dates",
          text: "Nominated-day delivery, cut-off times and carrier rules shown at the right step.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Validation and rules",
          text: "Block or warn on undeliverable addresses, restricted items and impossible combinations before payment.",
          plans: "Plus for custom apps",
          plusOnly: true,
        },
        {
          title: "Upsells and trust content",
          text: "Gift wrap, add-ons and returns promises in the steps and on the thank-you page.",
          plans: "Thank-you page: Basic and up",
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "A nominated delivery day, chosen at the right moment.",
      text: "The shopper picks Thursday, the order carries it to your warehouse, and your team sees it without opening an email.",
      checks: [
        { title: "Cut-off times", text: "that change with the carrier." },
        { title: "The choice saved to the order", text: "for fulfilment." },
        { title: "Styled to your brand,", text: "so it feels like part of your store." },
      ],
      sceneLabel:
        "Example checkout: the shopper nominates Thursday 23 October for delivery at £4.50, adds a gift wrap option, and the total is £63.00.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "Checkout on Plus, and everywhere else.",
      intro:
        "The deepest checkout changes are a Plus feature. There is still plenty to do on other plans.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "Every checkout step.",
              text: "UI extensions on information, shipping and payment, styled to your brand.",
            },
            {
              title: "Rules before payment.",
              text: "Cart and delivery validation written for your store only.",
            },
            {
              title: "Branding and layout.",
              text: "Checkout styling and layout controls, as far as the platform allows.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Shopify and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Thank-you and order status pages",
              text: "for post-purchase offers, surveys and reorder buttons.",
            },
            {
              title: "Cart-page features",
              text: "delivery estimates, add-ons and gift options before checkout begins.",
            },
            {
              title: "Order data carried through",
              text: "fields captured in the cart and attached to the order.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Do I need Shopify Plus?",
        answer:
          "For changes inside the information, shipping and payment steps, yes. For the thank-you page, the order status page and the cart, no. We design the app so the Plus-only parts switch on when you upgrade.",
      },
      {
        question: "Will it slow checkout down?",
        answer:
          "Extensions run on Shopify's own infrastructure in a sandbox. We measure checkout speed before and after launch.",
      },
      {
        question: "What about Shop Pay and Apple Pay?",
        answer:
          "Express payments skip some steps, so we design rules that work on both paths and tell you where a field can't appear.",
      },
      {
        question: "How long does it take?",
        answer:
          "Most checkout extensions take 6 to 12 weeks from the first call to live, depending on how many rules sit behind them.",
      },
    ],
  },

  /* ------------------------------------------------------ Integrations */
  "erp-and-warehouse-integrations": {
    slug: "erp-and-warehouse-integrations",
    name: "ERP and warehouse integrations",
    metaTitle: "Custom Shopify ERP and Warehouse Integrations",
    metaDescription:
      "Two-way sync between Shopify and your ERP, warehouse or 3PL, with retries, logs and alerts your team can read. Fixed price, and the code is yours.",
    enquiryArea: "Integrations",
    hero: {
      eyebrow: "Integrations",
      titleLines: [
        { text: "Your ERP and Shopify," },
        { text: "finally in agreement.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Orders, stock, prices and tracking moving between Shopify and the systems your business runs on, with retries, logs and alerts your team can actually read.",
      cta: "Tell us what needs to sync",
      imageAlt:
        "A warehouse operative checking a rugged tablet beside a conveyor of parcels, with tall shelving of labelled crates behind.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "Connectors work until the volume does.",
      intro:
        "Off-the-shelf connectors suit simple shops. Trouble starts with two warehouses, a custom ERP or a sale day.",
      items: [
        {
          title: "Stock that drifts.",
          text: "A missed update leaves a sold-out item on sale, or a bestseller marked out of stock. Nobody notices until a customer does.",
        },
        {
          title: "Failures nobody sees.",
          text: "When a sync step breaks it often fails silently. The first alert is an angry email.",
        },
        {
          title: "Rules in someone else's template.",
          text: "Your product codes, units and warehouse logic don't match the connector's model, so people patch the gaps by hand.",
        },
      ],
    },
    band: {
      eyebrow: "Operations",
      title: "The quiet systems behind every order.",
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "Syncs your team can trust.",
      intro:
        "Each integration is built around your data, with the unglamorous parts done properly.",
      items: [
        {
          title: "Two-way order and stock sync",
          text: "Orders out, stock and prices in, on a schedule that suits your operation.",
          plans: "All plans",
        },
        {
          title: "Warehouse and 3PL connections",
          text: "Pick, pack and tracking written back to Shopify with the right statuses.",
          plans: "All plans",
        },
        {
          title: "ERP, PIM and accounting",
          text: "Product data, price lists and invoices flowing between the systems that own them.",
          plans: "All plans",
        },
        {
          title: "Monitoring your team can read",
          text: "Retries, logs and plain-language alerts, so a failure is a message, not a mystery.",
          plans: "All plans",
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "A failed sync that fixes itself, and tells you.",
      text: "A 3PL times out on one order. The app retries, records why, and alerts your team only if it still fails after the third attempt.",
      checks: [
        { title: "Retries", text: "with sensible back-off." },
        { title: "A log", text: "your support team can search." },
        { title: "Alerts to email or Slack,", text: "only when action is needed." },
      ],
      sceneLabel:
        "Example sync monitor: three orders sent to the 3PL, 312 SKUs restocked from the ERP, one timeout retried automatically.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "Integrations work on every plan.",
      intro: "Plus adds scale and extra surfaces; the core of the work is the same everywhere.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "Many stores, one sync.",
              text: "One integration serving every regional store, configured per market.",
            },
            {
              title: "Heavy sale days.",
              text: "Throughput designed for peak order volumes.",
            },
            {
              title: "Checkout data in the ERP.",
              text: "Delivery choices and custom fields travel with the order.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Shopify and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Admin API and webhooks",
              text: "scheduled jobs and live triggers, built for your volumes.",
            },
            {
              title: "A status screen in your Shopify admin",
              text: "showing what synced, what is waiting and what failed.",
            },
            {
              title: "Hosting in your name",
              text: "on accounts your company owns and controls.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Which systems can you connect?",
        answer:
          "Anything with an API, a file drop or a database we can reach: ERPs such as NetSuite, SAP Business One and Dynamics, plus PIMs, warehouse systems and 3PLs. We confirm access on the first call.",
      },
      {
        question: "Why not use a connector or an automation tool?",
        answer:
          "If a connector does the job, use it, and we'll say so. We build when your rules, volumes or reliability needs go beyond what a template can model.",
      },
      {
        question: "Where does the data live?",
        answer:
          "In systems your company owns. The app runs on hosting in your name, and we don't keep a copy of your orders.",
      },
      {
        question: "What happens when the ERP is down?",
        answer:
          "Orders queue and retry. Nothing is lost, and the log shows exactly what is waiting.",
      },
    ],
  },

  /* ------------------------------------------------------------- B2B */
  "b2b-and-wholesale": {
    slug: "b2b-and-wholesale",
    name: "B2B and wholesale apps",
    metaTitle: "Custom Shopify B2B and Wholesale Apps",
    metaDescription:
      "Trade prices, terms, approvals and reordering for stockists on the same Shopify store as retail. Built as a private app. Fixed price, and the code is yours.",
    enquiryArea: "B2B and wholesale",
    hero: {
      eyebrow: "B2B and wholesale",
      titleLines: [
        { text: "Wholesale that works" },
        { text: "beside your retail store.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Trade prices, terms and minimums for stockists, on the same Shopify store as your retail customers. Shopify's native B2B covers the basics; we build the rules, limits and tools your trade buyers actually need.",
      cta: "Tell us how you sell wholesale",
      imageAlt:
        "A brand representative and a shop-owner buyer reviewing an order on a tablet at a wooden showroom table with folded linen samples.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "Trade buyers don't shop like retail customers.",
      intro: "They reorder, they have terms, and they know what they paid last time.",
      items: [
        {
          title: "Price lists that don't fit.",
          text: "Stockist tiers, regional trade prices and negotiated rates outgrow a handful of catalogues.",
        },
        {
          title: "Terms and approvals by hand.",
          text: "Net-30, credit limits and order approvals live in email threads and a spreadsheet.",
        },
        {
          title: "Reordering is painful.",
          text: "Buyers re-key last season's order line by line instead of repeating it in one click.",
        },
      ],
    },
    band: {
      eyebrow: "Trade",
      title: "Every stockist, their own prices and terms.",
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "Wholesale, without a second store.",
      intro: "Trade and retail share one store, with the right prices and checkout for each.",
      items: [
        {
          title: "Price lists beyond the limits",
          text: "Per-company prices, many tiers and ERP-driven price lists, where native catalogues run out.",
          plans: "All plans",
        },
        {
          title: "Approvals and credit",
          text: "Order approvals, buyer roles and credit limits checked before an order is accepted, tied to your accounting.",
          plans: "All plans",
        },
        {
          title: "Quick order and reorder",
          text: "Paste a list of SKUs, upload a CSV or repeat a past order in one step.",
          plans: "All plans",
        },
        {
          title: "Trade portal and quotes",
          text: "A page for stockists to see prices, orders and invoices, and to ask for a quote.",
          plans: "All plans",
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "Twelve units of a face oil, at the trade price, on net-30.",
      text: "A stockist repeats last month's order. Trade prices and terms apply automatically, and your team sees an order ready to fulfil.",
      checks: [
        { title: "Trade price by company,", text: "from one list." },
        { title: "Net-30 applied", text: "at checkout." },
        { title: "Reorder from history", text: "in one click." },
      ],
      sceneLabel:
        "Example trade order: 12 units of a face oil at the trade price of £18.70 on net-30 terms, total £224.40.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "B2B on every plan, with more room on Plus.",
      intro:
        "Shopify's native B2B works on most paid plans. Plus lifts its limits, and an app can close much of the gap elsewhere.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "More headroom.",
              text: "Unlimited catalogues, assigned directly to companies and locations, extended with your own rules.",
            },
            {
              title: "Deposits and partial payments.",
              text: "Customer-specific deposits and partial payments, with the approvals around them.",
            },
            {
              title: "Many stores, one trade offer.",
              text: "The same wholesale rules across your regional stores.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Grow and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Native B2B, within its limits",
              text: "companies, catalogues and net terms, with up to three catalogues.",
            },
            {
              title: "An app for what lies beyond",
              text: "per-company pricing, approvals and reorder tools built around your stockists.",
            },
            {
              title: "A planned upgrade path",
              text: "so the Plus-only parts switch on when you move up.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Doesn't Shopify already have B2B?",
        answer:
          "Yes. Native B2B covers companies, catalogues and net payment terms on Basic, Grow, Advanced and Plus. We build what it doesn't: more tiers than the catalogue limits allow, approvals, ERP-driven prices, quotes and reorder tools.",
      },
      {
        question: "Can we keep retail and wholesale on one store?",
        answer:
          "Usually, yes. Trade buyers log in to see their own prices, catalogue and terms, and retail visitors see the normal store.",
      },
      {
        question: "What about stockists who pay by invoice?",
        answer:
          "We support net terms, credit limits and invoicing flows, and send the order on to your accounting system.",
      },
      {
        question: "Is it worth it if we're not on Plus?",
        answer:
          "Often. Other plans are capped at three catalogues and can't assign them directly to companies, which is where a custom app helps most. Plus lifts those limits when you are ready for them.",
      },
    ],
  },

  /* ---------------------------------------------------- Configurators */
  "product-configurators": {
    slug: "product-configurators",
    name: "Product configurators",
    metaTitle: "Custom Shopify Product Configurators and Personalisation",
    metaDescription:
      "Configurators, engraving, personalisation and made-to-order flows built as theme app blocks for your Shopify store. Fixed price, and the code is yours.",
    enquiryArea: "Storefront",
    hero: {
      eyebrow: "Product configurators",
      titleLines: [
        { text: "Products your shoppers" },
        { text: "can make their own.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Configurators, personalisation and made-to-order flows built as theme app blocks your designers can place, with pricing, previews and production notes that follow the order.",
      cta: "Tell us what shoppers should choose",
      imageAlt:
        "A potter's hands engraving initials into the base of a speckled sage-green stoneware mug on a workbench beside a glaze notebook.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "Standard variants can't hold a custom product.",
      intro:
        "Shopify handles size and colour well. It struggles when choices multiply or change the price.",
      items: [
        {
          title: "Too many combinations.",
          text: "Glaze, size, initials and packaging multiply into hundreds of variants nobody wants to manage.",
        },
        {
          title: "Hidden costs.",
          text: "Personalisation that changes the price or the lead time is hard to show before add to basket.",
        },
        {
          title: "Orders your team can't read.",
          text: "Custom choices end up as free-text notes, and production re-types them.",
        },
      ],
    },
    gallery: {
      eyebrow: "Made to be personal",
      title: "Three ways a shopper makes it theirs.",
      intro:
        "From the glaze to the message to the gift box, each choice is captured as clean data your workshop can act on.",
      captions: ["Choose the glaze", "Add a name or a message", "Send it as a gift"],
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "Choices that turn into clean orders.",
      intro: "Every option is captured as structured data, so nothing is re-typed downstream.",
      items: [
        {
          title: "Product configurators",
          text: "Step-by-step choices with live price, preview and rules about what combines.",
          plans: "All plans",
        },
        {
          title: "Personalisation",
          text: "Engraving, monograms and uploads, with limits, previews and clean production files.",
          plans: "All plans",
        },
        {
          title: "Made-to-order and lead times",
          text: "Stock rules, delivery estimates and production notes tied to each choice.",
          plans: "All plans",
        },
        {
          title: "Product finders and size advisors",
          text: "Guided questions that point shoppers to the right product, in your words.",
          plans: "All plans",
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "A mug with initials on the base, for £4 extra.",
      text: "The shopper picks a glaze, types two initials and sees the price change before adding to the basket. Your workshop gets a production slip with exactly what was chosen.",
      checks: [
        { title: "Live price", text: "and preview as choices change." },
        { title: "Structured data", text: "for production, not free text." },
        { title: "Placed by your designers", text: "as a theme block." },
      ],
      sceneLabel:
        "Example configurator: a speckled stoneware mug at £28 with engraved initials M.A. for £4 extra, total £32.00.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "Storefront features run on every plan.",
      intro: "Theme app blocks work on any plan. Plus adds more places for the choices to appear.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "Choices at checkout.",
              text: "Personalisation visible at the checkout steps, not only on the product page.",
            },
            {
              title: "Rules by market.",
              text: "Different options, prices and lead times for each regional store.",
            },
            {
              title: "Validation before payment.",
              text: "Block combinations you can't make, before the order is placed.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Shopify and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Theme app blocks",
              text: "placed by your designers in the theme editor, with no code edits.",
            },
            {
              title: "Line-item properties",
              text: "that carry every choice to the order and to fulfilment.",
            },
            {
              title: "Hosting for uploads and previews",
              text: "on accounts in your name.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Will it slow my product page?",
        answer:
          "The configurator loads only on products that use it, and we measure page speed before and after launch.",
      },
      {
        question: "Will it match our theme?",
        answer:
          "Yes. The blocks are built to your theme's styles, so they look native, and your designers can place them without touching code.",
      },
      {
        question: "How do orders reach our workshop?",
        answer:
          "Choices are saved as structured line-item data. We can also send a production slip, a file or a webhook to your workshop software.",
      },
      {
        question: "Can the price depend on the choices?",
        answer:
          "Yes: fixed add-ons, percentage changes or rules based on the combination, shown live and checked again at checkout.",
      },
    ],
  },

  /* ------------------------------------------------------ Membership */
  "membership-and-subscriptions": {
    slug: "membership-and-subscriptions",
    name: "Membership and subscription apps",
    metaTitle: "Custom Shopify Membership and Subscription Apps",
    metaDescription:
      "A members' portal, member pricing and subscriptions priced per currency, built as a private Shopify app. Fixed price, and the code is yours.",
    enquiryArea: "Memberships and subscriptions",
    hero: {
      eyebrow: "Membership and subscriptions",
      titleLines: [
        { text: "A members' area that" },
        { text: "prices in every currency.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Paid or free memberships, a portal your members actually use, and subscriptions priced properly in each market. Built around how your business works, on top of Shopify's own subscription tools.",
      cta: "Tell us about your membership",
      imageAlt:
        "A woman at a kitchen table opening a dark green monthly delivery box, a membership card beside it and a laptop showing a dashboard.",
    },
    problem: {
      eyebrow: landingCopy.problemEyebrow,
      title: "Memberships are easy to start and hard to keep tidy.",
      intro:
        "Signing members up is the easy part. Keeping their status, prices and renewals right, in every currency, is the work.",
      items: [
        {
          title: "Status that drifts.",
          text: "A failed payment or a pause should change a member's access and prices at once, not when someone remembers.",
        },
        {
          title: "Prices that don't travel.",
          text: "A £12 membership is not simply €12. Each market needs its own price, rounding and tax treatment.",
        },
        {
          title: "A portal that is really a form.",
          text: "Members want to see their plan, change a delivery, pause or upgrade without emailing support.",
        },
      ],
    },
    build: {
      eyebrow: landingCopy.buildEyebrow,
      title: "A membership that runs itself.",
      intro:
        "We build the parts Shopify's subscription tools leave to you: status, the portal and the rules.",
      items: [
        {
          title: "Member portal",
          text: "Plan, renewal date, orders and perks in the customer account, with self-service changes.",
          plans: "Basic and up",
        },
        {
          title: "Member pricing and perks",
          text: "Member rates by percentage or fixed price, early access and members-only products.",
          plans: "All plans",
        },
        {
          title: "Subscriptions in several currencies",
          text: "Plans priced per market, renewals charged in the customer's currency, status kept in sync.",
          plans: "All plans",
        },
        {
          title: "Failed payments, pauses and upgrades",
          text: "Retries, pause and skip, upgrades and cancellations that follow your rules.",
          plans: "All plans",
        },
      ],
    },
    example: {
      eyebrow: landingCopy.exampleEyebrow,
      title: "One membership, priced for each market.",
      text: "A member in Dublin pays €14, one in London £12 and one in Denver $15. Each sees their own price, their own renewal date and the same member perks.",
      checks: [
        { title: "Fixed prices per market,", text: "not a rough conversion." },
        { title: "Status updates", text: "the moment a payment changes." },
        { title: "Self-service", text: "pause, skip and upgrade." },
      ],
      sceneLabel:
        "Example membership: a monthly plan priced at £12 in the UK, €14 in the eurozone and $15 in the US, with a member portal showing the next box on 12 November.",
    },
    plans: {
      eyebrow: landingCopy.planEyebrow,
      title: "Memberships on Plus, and on every other plan.",
      intro: "The portal, status and pricing work on any plan. Plus adds rules inside checkout.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            {
              title: "Member rules in checkout.",
              text: "Member pricing, delivery and payment rules written for your store only.",
            },
            {
              title: "Many stores, one membership.",
              text: "One member list across your regional stores.",
            },
            {
              title: "Company memberships.",
              text: "Plans held by a business, with several buyers under one account.",
            },
          ],
        },
        {
          id: "rest",
          audience: "For Basic, Shopify and Advanced stores",
          title: "Every other plan",
          items: [
            {
              title: "Billing through proven tools",
              text: "on Shopify's selling plans or an app such as Recharge or Skio, with our app handling status and the portal.",
            },
            {
              title: "Member rates by automatic discount",
              text: "using customer tags and segments.",
            },
            {
              title: "Local-currency checks first",
              text: "pricing in other currencies needs a payment setup that supports it.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can it charge in different currencies?",
        answer:
          "Yes, where your payments setup supports it. Local-currency subscriptions generally need Shopify Payments or a compatible gateway, and a subscription keeps the currency it was bought in. We check your setup on the first call.",
      },
      {
        question: "Do you replace Recharge or Skio?",
        answer:
          "Often we don't. A billing app can handle renewals while our app handles member status, the portal and perks. We build the billing layer only when your rules need it.",
      },
      {
        question: "What about auto-renewal rules?",
        answer:
          "In the UK and EU, subscriptions need clear consent, easy cancellation and renewal reminders. We build these in, but you should check them with your own legal adviser.",
      },
      {
        question: "How is member status kept accurate?",
        answer:
          "Subscription events update status as they happen, and a scheduled check catches anything that was missed.",
      },
    ],
  },
};

export const allLandings = landingSlugs.map((slug) => landings[slug]);
