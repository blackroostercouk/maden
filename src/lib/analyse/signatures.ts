import type { AppCategory } from "./types";

/**
 * What each app leaves in a storefront. To add one, add a line.
 *   hosts   domains the app loads scripts, styles or frames from (strongest evidence)
 *   markers class names or ids its widgets print into the page (weaker evidence)
 * Everything is lower-case; matching is by substring.
 */
export type Signature = {
  id: string;
  name: string;
  category: AppCategory;
  hosts: string[];
  markers?: string[];
};

export const categoryLabels: Record<AppCategory, string> = {
  reviews: "Reviews",
  ugc: "UGC and social proof",
  "email-sms": "Email and SMS",
  subscriptions: "Subscriptions",
  loyalty: "Loyalty and rewards",
  support: "Support and chat",
  "page-builders": "Page builders",
  search: "Search and personalisation",
  upsell: "Upsell and cart",
  analytics: "Analytics and ads",
  consent: "Consent and privacy",
  shipping: "Shipping and tracking",
  payments: "Payments and financing",
  translation: "Translation",
};

export const categoryOrder: AppCategory[] = [
  "reviews",
  "ugc",
  "email-sms",
  "subscriptions",
  "loyalty",
  "upsell",
  "search",
  "page-builders",
  "support",
  "shipping",
  "payments",
  "analytics",
  "consent",
  "translation",
];

export const signatures: Signature[] = [
  // Reviews
  {
    id: "judgeme",
    name: "Judge.me",
    category: "reviews",
    hosts: ["judge.me", "judgeme.com"],
    markers: ["jdgm-"],
  },
  { id: "yotpo", name: "Yotpo", category: "reviews", hosts: ["yotpo.com"], markers: ["yotpo-"] },
  { id: "loox", name: "Loox", category: "reviews", hosts: ["loox.io"], markers: ["loox-"] },
  {
    id: "okendo",
    name: "Okendo",
    category: "reviews",
    hosts: ["okendo.io"],
    markers: ["okereviews", "oke-"],
  },
  {
    id: "stamped",
    name: "Stamped",
    category: "reviews",
    hosts: ["stamped.io"],
    markers: ["stamped-"],
  },
  { id: "junip", name: "Junip", category: "reviews", hosts: ["juniphq.com"], markers: ["junip-"] },
  { id: "fera", name: "Fera", category: "reviews", hosts: ["fera.ai"], markers: ["fera-"] },
  { id: "reviewsio", name: "Reviews.io", category: "reviews", hosts: ["reviews.io"] },
  {
    id: "trustpilot",
    name: "Trustpilot widget",
    category: "reviews",
    hosts: ["widget.trustpilot.com", "invitejs.trustpilot.com"],
  },
  { id: "bazaarvoice", name: "Bazaarvoice", category: "reviews", hosts: ["bazaarvoice.com"] },
  {
    id: "shopify-reviews",
    name: "Shopify Product Reviews",
    category: "reviews",
    hosts: ["productreviews.shopifycdn.com"],
  },

  // UGC and social proof
  {
    id: "pixlee",
    name: "Emplifi (Pixlee)",
    category: "ugc",
    hosts: ["pixlee.com", "pixlee.co", "emplifi.io"],
  },
  { id: "tagembed", name: "Tagembed", category: "ugc", hosts: ["tagembed.com"] },
  { id: "taggbox", name: "Taggbox", category: "ugc", hosts: ["taggbox.com"] },
  { id: "foursixty", name: "Foursixty", category: "ugc", hosts: ["foursixty.com"] },
  { id: "curalate", name: "Bazaarvoice Curalate", category: "ugc", hosts: ["curalate.com"] },

  // Email and SMS
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "email-sms",
    hosts: ["klaviyo.com"],
    markers: ["klaviyo-form"],
  },
  {
    id: "omnisend",
    name: "Omnisend",
    category: "email-sms",
    hosts: ["omnisnippet", "omnisrc.com", "omnisend.com"],
  },
  {
    id: "attentive",
    name: "Attentive",
    category: "email-sms",
    hosts: ["attn.tv", "attentivemobile.com"],
  },
  { id: "postscript", name: "Postscript", category: "email-sms", hosts: ["postscript.io"] },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "email-sms",
    hosts: ["chimpstatic.com", "mailchimp.com"],
  },
  { id: "privy", name: "Privy", category: "email-sms", hosts: ["privy.com"] },
  { id: "drip", name: "Drip", category: "email-sms", hosts: ["getdrip.com"] },

  // Subscriptions
  {
    id: "recharge",
    name: "Recharge",
    category: "subscriptions",
    hosts: ["rechargeapps.com", "rechargepayments.com"],
  },
  { id: "skio", name: "Skio", category: "subscriptions", hosts: ["skio.com"] },
  { id: "loop", name: "Loop Subscriptions", category: "subscriptions", hosts: ["loopwork.co"] },
  {
    id: "bold",
    name: "Bold Commerce apps",
    category: "upsell",
    hosts: ["boldapps.net", "boldcommerce.com"],
  },
  {
    id: "seal",
    name: "Seal Subscriptions",
    category: "subscriptions",
    hosts: ["sealsubscriptions.com"],
  },

  // Loyalty
  { id: "smile", name: "Smile.io", category: "loyalty", hosts: ["smile.io"] },
  { id: "loyaltylion", name: "LoyaltyLion", category: "loyalty", hosts: ["loyaltylion.com"] },

  // Support and chat
  { id: "gorgias", name: "Gorgias", category: "support", hosts: ["gorgias.chat", "gorgias.io"] },
  { id: "tidio", name: "Tidio", category: "support", hosts: ["tidio.co", "tidiochat.com"] },
  { id: "zendesk", name: "Zendesk", category: "support", hosts: ["zdassets.com", "zendesk.com"] },
  {
    id: "intercom",
    name: "Intercom",
    category: "support",
    hosts: ["intercomcdn.com", "intercom.io"],
  },
  { id: "reamaze", name: "Re:amaze", category: "support", hosts: ["reamaze.com"] },

  // Page builders
  { id: "pagefly", name: "PageFly", category: "page-builders", hosts: ["pagefly.io"] },
  {
    id: "shogun",
    name: "Shogun",
    category: "page-builders",
    hosts: ["shogun.page", "getshogun.com"],
  },
  {
    id: "gempages",
    name: "GemPages",
    category: "page-builders",
    hosts: ["gempages.net", "gempages.app"],
  },
  { id: "replo", name: "Replo", category: "page-builders", hosts: ["replo.app"] },

  // Search and personalisation
  { id: "searchanise", name: "Searchanise", category: "search", hosts: ["searchanise.com"] },
  { id: "algolia", name: "Algolia", category: "search", hosts: ["algolia.net", "algolianet.com"] },
  { id: "boost", name: "Boost Commerce", category: "search", hosts: ["boostcommerce.net"] },
  { id: "klevu", name: "Klevu", category: "search", hosts: ["klevu.com"] },
  { id: "searchspring", name: "Searchspring", category: "search", hosts: ["searchspring.io"] },
  { id: "nosto", name: "Nosto", category: "search", hosts: ["nosto.com"] },

  // Upsell and cart
  { id: "rebuy", name: "Rebuy", category: "upsell", hosts: ["rebuyengine.com"] },
  { id: "aftersell", name: "AfterSell", category: "upsell", hosts: ["aftersell.app"] },

  // Analytics and ads
  {
    id: "gtm",
    name: "Google Tag Manager",
    category: "analytics",
    hosts: ["googletagmanager.com/gtm.js"],
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "analytics",
    hosts: ["googletagmanager.com/gtag/js", "google-analytics.com"],
  },
  { id: "meta-pixel", name: "Meta Pixel", category: "analytics", hosts: ["connect.facebook.net"] },
  {
    id: "tiktok-pixel",
    name: "TikTok Pixel",
    category: "analytics",
    hosts: ["analytics.tiktok.com"],
  },
  {
    id: "pinterest-tag",
    name: "Pinterest Tag",
    category: "analytics",
    hosts: ["s.pinimg.com/ct", "ct.pinterest.com"],
  },
  { id: "snap-pixel", name: "Snap Pixel", category: "analytics", hosts: ["sc-static.net"] },
  { id: "hotjar", name: "Hotjar", category: "analytics", hosts: ["hotjar.com"] },
  { id: "clarity", name: "Microsoft Clarity", category: "analytics", hosts: ["clarity.ms"] },
  { id: "segment", name: "Segment", category: "analytics", hosts: ["segment.com", "segment.io"] },
  { id: "heap", name: "Heap", category: "analytics", hosts: ["heapanalytics.com"] },
  {
    id: "luckyorange",
    name: "Lucky Orange",
    category: "analytics",
    hosts: ["luckyorange.com", "luckyorange.net"],
  },

  // Consent and privacy
  {
    id: "onetrust",
    name: "OneTrust",
    category: "consent",
    hosts: ["onetrust.com", "cookielaw.org"],
  },
  { id: "cookiebot", name: "Cookiebot", category: "consent", hosts: ["cookiebot.com"] },
  { id: "usercentrics", name: "Usercentrics", category: "consent", hosts: ["usercentrics.eu"] },

  // Shipping and tracking
  { id: "aftership", name: "AfterShip", category: "shipping", hosts: ["aftership.com"] },
  { id: "route", name: "Route", category: "shipping", hosts: ["route.com", "routeapp.io"] },
  { id: "narvar", name: "Narvar", category: "shipping", hosts: ["narvar.com"] },
  { id: "loopreturns", name: "Loop Returns", category: "shipping", hosts: ["loopreturns.com"] },
  { id: "returnly", name: "Returnly", category: "shipping", hosts: ["returnly.com"] },
  { id: "returngo", name: "ReturnGO", category: "shipping", hosts: ["returngo.ai"] },

  // Translation
  { id: "weglot", name: "Weglot", category: "translation", hosts: ["weglot.com"] },
  { id: "langify", name: "Langify", category: "translation", hosts: ["langify-app.com"] },
  {
    id: "gtranslate",
    name: "GTranslate",
    category: "translation",
    hosts: ["gtranslate.net", "gtranslate.io"],
  },
  { id: "transcy", name: "Transcy", category: "translation", hosts: ["transcy.io"] },

  // Payments and financing
  { id: "klarna", name: "Klarna", category: "payments", hosts: ["klarna.com"] },
  { id: "afterpay", name: "Afterpay", category: "payments", hosts: ["afterpay.com"] },
  { id: "affirm", name: "Affirm", category: "payments", hosts: ["affirm.com"] },
];
