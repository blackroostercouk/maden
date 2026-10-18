/**
 * All copy and data for the site, in British English.
 * Sections read from here, so wording changes never touch components.
 */
import type { CompareRow, Plan, Service, Step } from "@/components/blocks";
import type { WeightItem } from "@/components/mock";
import type { CheckItem, HeadingLine, Spec } from "@/components/ui";

export const brand = {
  name: "Moden",
  descriptor: "Custom Shopify apps",
  legalName: "Moden",
  location: "London",
  year: 2026,
  title: "Custom Shopify Apps | Moden",
  description:
    "Custom Shopify apps for the things no app does. Fixed price, code in your name, built for Shopify Plus and every other plan.",
} as const;

export type NavLink = { href: `#${string}` | `/${string}`; label: string; short?: string };

/** Public address of the site, used for canonical links and the sitemap. */
export const siteUrl = "https://moden.studio";

export const navigation: NavLink[] = [
  { href: "#fit", label: "Why custom" },
  { href: "#build", label: "What we build" },
  { href: "#ai", label: "AI features", short: "AI" },
  { href: "/products", label: "Products" },
  { href: "#plans", label: "Plus and other plans", short: "Plans" },
  { href: "#process", label: "How it works" },
  { href: "/compare", label: "Compare stores", short: "Compare" },
];

export const primaryCta = { href: "#enquire", label: "Begin a conversation" } as const;

/* ---------------------------------------------------------------- Hero */
export const hero = {
  titleLines: [
    { text: "When no Shopify app fits," },
    { text: "we build the one that does.", tone: "accent", italic: true, weight: "light" },
  ] satisfies HeadingLine[],
  lede: "Some of what your store needs doesn't exist in the App Store: a pricing rule only you use, a link to your ERP. We build a private app for that one job. Fixed price, and the code is yours.",
  primaryCta: { href: "#enquire", label: "Tell us what's missing" },
  secondaryCta: { href: "#process", label: "How a commission works" },
  specs: [
    { term: "Scope", detail: "One job, done properly" },
    { term: "Price", detail: "Fixed, agreed up front" },
    { term: "Ownership", detail: "Code in your name" },
    { term: "Timeline", detail: "Typically 6 to 12 weeks" },
  ] satisfies Spec[],
  sceneLabel:
    "Example commission: a small homeware brand packing an order, with a custom gift-wrap option in its checkout and a stock sync app reporting 1,284 orders sent to its ERP today.",
} as const;

/* ----------------------------------------------------------- Statement */
export const statement = {
  lead: "An App Store app is built for thousands of stores at once. You work inside its settings, live with its limits, and pay for it every month.",
  emphasis: "We make one app, for one brand,",
  tail: "and hand it over.",
  body: "When the app you need doesn't exist, the usual answer is a workaround: a spreadsheet, a manual step, a compromise your team makes every day. Every commission starts with your operations instead: your catalogue, your fulfilment, your checkout rules. The result lives inside your Shopify admin, does one job, and has nothing in it you didn't ask for.",
  figure: {
    alt: "A hand sketching an app wireframe in a notebook at a dark wooden desk, with interface sketches pinned to a green wall behind and a laptop beside it",
    caption: "Built around your operations, one brand at a time.",
    credit: "Fixed price, and the code is yours.",
  },
} as const;

/* ---------------------------------------------------------- Why custom */
export const whyCustom = {
  eyebrow: "Why custom",
  title: "Off the shelf, or built for you.",
  intro:
    "Public apps are the right choice for common jobs, and if one already does what you need, we'll say so on the first call. When none of them fits, this is the difference you're paying for.",
  columns: { theirs: "App Store app", ours: "A Moden app" },
  rows: [
    {
      aspect: "Fit",
      theirs: "Built for the typical store. Your team adapts its process to the app's settings.",
      ours: "Built around the way your team already works.",
    },
    {
      aspect: "Rules",
      theirs:
        "The developer decides what it can do, and what it never will. Feature requests join a queue.",
      ours: "Your rules, written into your own code. Changes ship when you need them.",
    },
    {
      aspect: "Cost",
      theirs: "A monthly fee for every app, often rising with your plan or order volume.",
      ours: "One fixed price for the build. Hosting runs on your own accounts, at cost.",
    },
    {
      aspect: "Speed",
      theirs:
        "Each app can load its own scripts and styles on every page, and some leave code in your theme after they're uninstalled.",
      ours: "One app that loads only where it's used, tested against your Core Web Vitals before launch.",
    },
    {
      aspect: "Upgrades",
      theirs:
        "Free and lower plans come with upgrade banners, locked features and pop-ups in your admin, pushing you to a higher tier.",
      ours: "No upgrade messages, no banners, no locked features. The app does its job and stays quiet.",
    },
    {
      aspect: "Ownership",
      theirs: "You rent access. Stop paying and it stops working.",
      ours: "Source code in your GitHub organisation. It keeps working whoever maintains it.",
    },
    {
      aspect: "Data",
      theirs: "Customer and order data passes through another company's servers.",
      ours: "Data stays in systems your company owns and controls.",
    },
  ] satisfies CompareRow[],
  cost: {
    eyebrow: "The cost you carry",
    hoursPerDay: 2,
    hourlyRate: 25,
    workingDays: 250,
    text: "Two hours a day re-keying orders, chasing stock and fixing exports, at £25 an hour. It never appears on an invoice, and it grows with every order.",
    note: "Example figures. We would rather work out the real number with you.",
  },
  weight: {
    eyebrow: "The weight of a generic app",
    text: "A generic app ships its whole feature set to every page, whether that page uses it or not. Slower pages lose shoppers before they see a product, and they pull down the Core Web Vitals that search rankings take into account.",
    chartTitle: "Example product page, scripts added by one generic app",
    chartPill: "Every page",
    items: [
      { label: "Core script", kb: 142 },
      { label: "Features you don't use", kb: 96 },
      { label: "Pop-ups and badges", kb: 88 },
      { label: "Tracking and analytics", kb: 61 },
    ] satisfies WeightItem[],
    totalLabel: "One generic app",
    ours: { label: "A focused Moden app", kb: 22 } satisfies WeightItem,
    note: "The custom app loads on product pages only. Figures are illustrative.",
    sceneLabel:
      "Example product page: one generic app adds 387 KB of scripts to every page, while a focused custom app adds 22 KB on product pages only.",
  },
} as const;

/* -------------------------------------------------------- What we build */
export const build = {
  eyebrow: "What we build",
  title: "Any function your store is missing.",
  intro:
    "These are the commissions we are asked for most. If yours isn't here, tell us about it. Tags show which Shopify plans can run each kind of app.",
  showcase: {
    checkout: {
      title: "Checkout extensions and Functions",
      text: "Pricing rules, delivery options and fields that exist only in your checkout. Shopify Plus.",
      sceneLabel:
        "Example checkout: a trade account discount of 18% and a nominated delivery day applied to a £145 trainer, total £118.90.",
    },
    admin: {
      title: "Integrations and admin tools",
      text: "Your ERP, warehouse and accounting software talking to Shopify every few minutes. Every plan.",
      sceneLabel:
        "Example fulfilment sync in a warehouse: an order sent to the 3PL, 312 SKUs restocked from the ERP and tracking numbers written back.",
    },
    b2b: {
      title: "B2B and wholesale",
      text: "Trade prices, terms and order minimums for stockists, beside your retail store. Every plan.",
      sceneLabel:
        "Example trade price list: a shop owner orders 12 units of a face oil at the trade price of £18.70 on net-30 terms.",
    },
    storefront: {
      title: "Storefront features",
      text: "Configurators, personalisation and product finders, placed by your designers as theme app blocks. Every plan.",
      sceneLabel:
        "Example product page on a phone: a stoneware mug with a choice of glaze and initials on the base for £4 extra.",
    },
  },
  services: [
    {
      title: "Checkout extensions",
      href: "/custom-apps/checkout-customisation",
      text: "Custom fields, upsells, delivery notes, gift options and trust content placed directly in the checkout steps.",
      plans: "Plus",
      plusOnly: true,
    },
    {
      title: "Discount and pricing logic",
      href: "/custom-apps/pricing-and-discounts",
      text: "Tiered, bundle, member and conditional discounts written as Shopify Functions, so they run inside Shopify at checkout speed.",
      plans: "Plus for custom apps",
      plusOnly: true,
    },
    {
      title: "B2B and wholesale",
      href: "/custom-apps/b2b-and-wholesale",
      text: "Trade pricing beyond native catalogue limits, approvals, quick order forms and reorder tools that sit beside your retail store without a second shop.",
      plans: "All plans",
    },
    {
      title: "Memberships and subscriptions",
      href: "/custom-apps/membership-and-subscriptions",
      text: "A members' portal, member pricing and subscriptions priced per market, working alongside Shopify's own subscription tools.",
      plans: "Basic and up",
    },
    {
      title: "Systems integrations",
      href: "/custom-apps/erp-and-warehouse-integrations",
      text: "Two-way sync with ERP, PIM, 3PL, POS and accounting platforms, with retries, logs and alerts your team can read.",
      plans: "All plans",
    },
    {
      title: "Admin tools",
      text: "Internal dashboards, bulk editors, approval flows and reports that open inside your Shopify admin.",
      plans: "All plans",
    },
    {
      title: "Storefront features",
      href: "/custom-apps/product-configurators",
      text: "Configurators, size advisors, appointment booking and product finders delivered as theme app blocks your designers can place.",
      plans: "All plans",
    },
    {
      title: "AI features",
      text: "Catalogue writing, customer service, search and forecasting built on your own data, as a feature of your app.",
      plans: "All plans",
    },
  ] satisfies Service[],
} as const;

/* ------------------------------------------------------------------ AI */
export const ai = {
  eyebrow: "AI features",
  title: "AI that knows your catalogue, your customers and your rules.",
  intro:
    "General-purpose AI tools know nothing about your store. We build AI into your app where it saves your team real time, using the model provider you choose and data that stays in your accounts. AI goes into your app where it helps your customers and staff. It doesn't write your app.",
  features: [
    {
      title: "Catalogue assistant.",
      text: "Descriptions, alt text and SEO fields drafted in your brand voice and approved by your team before anything goes live.",
    },
    {
      title: "Customer service agent.",
      text: "Answers order, delivery and returns questions from live order data and your own policies, and hands over to a person when it should.",
    },
    {
      title: "Search in your customers' words.",
      text: "Shoppers describe what they're after and see products that match, even when they don't know the product name.",
    },
    {
      title: "Forecasts and reorders.",
      text: "Sales patterns turned into reorder suggestions and stock alerts before a bestseller runs out.",
    },
    {
      title: "Back-office paperwork.",
      text: "Supplier emails, invoices and spreadsheets read and turned into Shopify records.",
    },
  ] satisfies CheckItem[],
  sceneLabel:
    "Example AI features: a catalogue assistant drafting a product description for approval, and a customer service reply answering a delivery question from live order data.",
} as const;

/* --------------------------------------------------------------- Plans */
export const plans = {
  eyebrow: "Plus and other plans",
  title: "Built for Shopify Plus. Right for every plan.",
  intro:
    "Plus gives a custom app the deepest access to checkout and pricing, so that is where most of our work happens. Stores on other plans still get a complete, private app made for them.",
  note: "Planning a move to Plus? We design apps so the Plus-only parts switch on when you upgrade, without a rebuild.",
  items: [
    {
      id: "plus",
      audience: "For Shopify Plus stores",
      title: "Shopify Plus",
      featured: true,
      items: [
        {
          title: "Every checkout step.",
          text: "UI extensions on the information, shipping and payment steps, styled to your brand.",
        },
        {
          title: "Shopify Functions in a private app.",
          text: "Your own discount, delivery, payment and cart validation rules, not shared with any other store.",
        },
        {
          title: "More B2B headroom.",
          text: "Unlimited catalogues, direct company assignment and deposits, extended with your trade rules.",
        },
        {
          title: "Expansion stores.",
          text: "One app installed across your regional stores, configured per market.",
        },
      ],
    },
    {
      id: "rest",
      audience: "For Basic, Shopify and Advanced stores",
      title: "Every other plan",
      items: [
        { title: "Admin apps", text: "that run your back office from inside Shopify." },
        { title: "Theme app blocks", text: "for storefront features without editing theme code." },
        { title: "Integrations", text: "with the systems you already pay for." },
        { title: "B2B tools", text: "for pricing, approvals and reordering beyond native limits." },
        {
          title: "Thank-you and order status extensions",
          text: "for post-purchase offers and surveys.",
        },
      ],
    },
  ] satisfies Plan[],
} as const;

/* ------------------------------------------------------------- Process */
export const process = {
  eyebrow: "How it works",
  title: "From first call to live store.",
  intro:
    "A commission follows the same five stages every time. You see a working preview every week from the build stage onward, and the price is fixed once the specification is agreed.",
  steps: [
    {
      name: "Discover",
      duration: "Week 1",
      text: "A working session with the people who will use the app. We map the process it replaces, the data it touches and the plan your store is on.",
    },
    {
      name: "Specify",
      duration: "1 to 2 weeks",
      text: "A written specification and a clickable prototype inside a development store. You approve the scope and receive a fixed quote.",
    },
    {
      name: "Build",
      duration: "3 to 8 weeks",
      text: "We build in weekly increments. Every change is reviewed by a second developer and tested before it reaches your preview. Each Friday you get a preview link and a short note on what changed.",
    },
    {
      name: "Launch",
      duration: "1 week",
      text: "Installed on your live store, tested against real orders, and walked through with your team until it feels like it was always there.",
    },
    {
      name: "Care",
      duration: "Ongoing",
      text: "Shopify releases a new API version every quarter. We move your app onto each one before the old version is retired, and keep it monitored.",
    },
  ] satisfies Step[],
} as const;

/* --------------------------------------------------------------- Craft */
export const craft = {
  eyebrow: "Who builds it",
  title: "Every line checked by a second pair of eyes.",
  lede: "Your app is written by the people on your first call. Every change is checked by a second developer and tested before it goes anywhere near your store.",
  principles: [
    {
      title: "One team, start to finish.",
      text: "Nobody hands your project off halfway. The people on the first call are the people who write the code.",
    },
    {
      title: "No unchecked AI code.",
      text: "Code that goes to your store is written by people who can explain every line of it, and reviewed by a second developer before it ships.",
    },
    {
      title: "Small on purpose.",
      text: "Each app does one job, so it stays easy to understand, test and maintain long after launch.",
    },
    {
      title: "Tested at every step.",
      text: "Automated tests, a run-through on a development store with your real catalogue, and a page-speed check before each release.",
    },
  ],
  review: {
    title: "Trade pricing rules",
    status: "Ready to release",
    meta: "Change 212, written by a developer",
    checks: [
      "Reviewed and approved by a second developer",
      "48 automated tests passed",
      "Checkout tested on a development store with your catalogue",
      "Page speed unchanged on product and cart pages",
      "Your team signed off the preview",
    ],
    action: "Release to live store",
  },
  sceneLabel:
    "Example code review: a pricing change reviewed by a second developer, 48 automated tests passed, checkout tested on a development store and page speed unchanged, ready to release.",
} as const;

/* ------------------------------------------------------------ Handover */
export const handover = {
  eyebrow: "Turnkey handover",
  title: "You own the app. We keep it current.",
  items: [
    {
      title: "Source code in your GitHub organisation,",
      text: "with a licence that lets any developer continue the work.",
    },
    {
      title: "Hosting, monitoring and logs",
      text: "set up on accounts in your company's name.",
    },
    {
      title: "Installed and tested on your live store",
      text: "before we call it finished, including page speed measured before and after launch.",
    },
    {
      title: "A written handbook and a recorded walkthrough",
      text: "for the people who use it every day.",
    },
    { title: "30 days of adjustments", text: "included after launch." },
  ] satisfies CheckItem[],
} as const;

/* ------------------------------------------------------------- Enquiry */
export const enquiry = {
  eyebrow: "Begin a conversation",
  title: "Describe the app your store needs.",
  intro:
    "Plain language is fine. Tell us what should happen, who uses it and what it replaces. We reply with questions, an honest view on whether a custom app is the right answer, or a time for the discovery session.",
  plans: ["Shopify Plus", "Advanced", "Shopify", "Basic", "Not sure"],
  areas: [
    "Checkout",
    "Discounts and pricing",
    "B2B and wholesale",
    "Memberships and subscriptions",
    "Integrations",
    "Admin tools",
    "Storefront",
    "Marketing",
    "UGC and reviews",
    "AI features",
    "Replacing a workaround or an app",
  ],
  budgets: ["£10,000 to £25,000", "£25,000 to £60,000", "£60,000 and above", "To be discussed"],
  timings: ["As soon as possible", "Within 3 months", "3 to 6 months", "Exploring for now"],
  briefPlaceholder:
    "For example: we pay for four apps to handle wholesale and still export orders to our ERP by hand. Trade customers should see net-30 terms at checkout and orders should sync every hour.",
  privacy: "We use these details only to reply to your enquiry.",
  submit: "Send your brief",
  sending: "Sending…",
  success: {
    title: "Enquiry received.",
    text: "We read every brief ourselves and reply within two working days.",
    again: "Send another enquiry",
  },
  failure: {
    title: "Your enquiry wasn't sent.",
    text: "Something went wrong on our side. Copy your enquiry below and email it to the studio, or try again in a moment.",
    copy: "Copy enquiry",
    copied: "Copied",
    retry: "Try again",
  },
} as const;

/* -------------------------------------------------------------- Footer */
export const footer = {
  disclaimer:
    "Moden is an independent studio. Shopify and Shopify Plus are trademarks of Shopify Inc.",
} as const;
