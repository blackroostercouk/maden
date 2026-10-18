/**
 * Copy for the ready-made products under /products/[slug], in British English.
 * Each is a private app installed on one store and set up around it, not a
 * public App Store listing. Scenes live in src/components/product.
 */
import type { Plan, Service, Step } from "@/components/blocks";
import type { CheckItem, HeadingLine } from "@/components/ui";
import type { LandingFaq } from "./landings";

export type Product = {
  slug: string;
  name: string;
  /** One line for cards and the index. */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  /** Pre-ticked area in the enquiry form. Must match an entry in enquiry.areas. */
  enquiryArea: string;
  /** Shown on cards. */
  plan: string;
  hero: {
    eyebrow: string;
    titleLines: HeadingLine[];
    lede: string;
    cta: string;
    imageAlt: string;
  };
  does: { title: string; intro: string; items: Service[] };
  /** Four admin and storefront screens, in the order shown. */
  screens: Array<{ title: string; text: string; alt: string }>;
  example: { title: string; text: string; checks: CheckItem[]; sceneLabel: string };
  plans: { title: string; intro: string; items: Plan[] };
  faq: LandingFaq[];
};

export const productSlugs = ["membership", "gifts", "favourites", "assistant"] as const;
export type ProductSlug = (typeof productSlugs)[number];

export const productCopy = {
  indexEyebrow: "Ready to install",
  indexTitle: "Four apps we have already built.",
  indexIntro:
    "Each one is finished, tested and installed privately on your store, then set up around how you sell. Need it different? We change it.",
  indexMetaTitle: "Ready-made Shopify apps",
  indexMetaDescription:
    "Membership, gifts, favourites and an AI assistant: finished private Shopify apps, installed on your store and set up around how you sell.",
  cardCta: "See how it works",
  screensEyebrow: "Inside the app",
  screensTitle: "See it before you install it.",
  screensIntro: "Real screens from the admin and the storefront. Yours are set up around your own products and rules.",
  trustEyebrow: "Why you can rely on it",
  trustTitle: "Finished, tested and yours alone.",
  trust: [
    { title: "Installed privately,", text: "on your store only." },
    { title: "No upgrade messages,", text: "banners or locked features in your admin." },
    { title: "Tested on a real basket", text: "with you before launch." },
    { title: "Rules edited by your team,", text: "no developer needed." },
    { title: "Supported after launch,", text: "by the people who built it." },
  ] satisfies CheckItem[],
  doesEyebrow: "What it does",
  howEyebrow: "How it comes to your store",
  planEyebrow: "Plans",
  faqEyebrow: "Questions",
  faqTitle: "Before we speak.",
  exampleEyebrow: "In the store",
  pricing: "Pricing on request",
  secondaryCta: "How it comes to your store",
  customTitle: "Need it to work differently?",
  customText:
    "These are starting points. We adapt each one to your rules, or build something new beside it.",
  customCta: "See custom apps",
  steps: [
    {
      name: "Install",
      duration: "Days",
      text: "We install the app privately on your store. It never appears in the App Store.",
    },
    {
      name: "Configure",
      duration: "A week or two",
      text: "We set it up around your products, markets and rules, and match your theme.",
    },
    {
      name: "Go live",
      duration: "When you are ready",
      text: "We test it on a real basket with you, launch it and stay on hand afterwards.",
    },
  ] satisfies Step[],
} as const;

export const products: Record<ProductSlug, Product> = {
  membership: {
    slug: "membership",
    name: "Membership",
    summary: "Paid tiers with member prices at checkout, priced in every market.",
    metaTitle: "Shopify Membership App for Plus Stores",
    metaDescription:
      "Starter and Plus tiers, member prices at checkout and prices set per product and market. A private Shopify app for Plus stores.",
    enquiryArea: "Memberships and subscriptions",
    plan: "Shopify Plus",
    hero: {
      eyebrow: "Membership",
      titleLines: [
        { text: "Member prices that" },
        { text: "show up at checkout.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Starter and Plus tiers for shoppers in every market and currency. Members see their price on the product, pay it at checkout, and cancel whenever they like.",
      cta: "Ask about Membership",
      imageAlt:
        "A woman at a laptop on a ceramics store's product page, a speckled mug at £24.00 against £30.00 with a member price label.",
    },
    does: {
      title: "A membership your shoppers can see.",
      intro: "Built for Plus stores selling in several markets.",
      items: [
        {
          title: "Starter and Plus tiers",
          text: "Two plans with their own price and perks, sold across your markets and currencies.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Member prices at checkout",
          text: "The member price appears on the product and is applied in the basket.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Rules per product and market",
          text: "Set the price, billing frequency and who can buy for each product in each market.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Cancel anytime",
          text: "Members cancel from their account, with no email to support.",
          plans: "Plus",
          plusOnly: true,
        },
      ],
    },
    screens: [
      { title: "Membership plans", text: "Set up Starter and Plus with their own price and perks, and see how many members each has.", alt: "Admin page listing Starter at £6.00 a month and Plus at £12.00 a month, with perks and member counts." },
      { title: "Prices by market", text: "Choose the member price, billing frequency and who can buy for each product in each market.", alt: "Admin table of products with member price, market, billing frequency and who can buy." },
      { title: "Members", text: "Every member, their plan, status and next renewal, with search and filters.", alt: "Admin members table with plan, status, join date, next renewal and market, above totals for members and monthly revenue." },
      { title: "The member account", text: "Members see their plan, savings and perks, and can change plan or cancel in one click.", alt: "Storefront account page showing a Plus plan at £12.00 a month, £86.00 saved this year and a cancel membership button." },
    ],
    example: {
      title: "The same mug, two prices.",
      text: "A member sees £24.00 where everyone else sees £30.00, and the saving is clear before they reach checkout.",
      checks: [
        { title: "Shown on the product,", text: "not discovered at checkout." },
        { title: "Set per market,", text: "not a rough conversion." },
        { title: "Cancelled in one click", text: "from the account." },
      ],
      sceneLabel:
        "Example product page: a speckled mug at £30.00, or £24.00 for members, with Starter and Plus tiers to choose from.",
    },
    plans: {
      title: "Built for Plus.",
      intro:
        "Member pricing at checkout relies on Shopify Functions in a custom app, which needs Shopify Plus.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            { title: "Full membership,", text: "prices applied at checkout." },
            { title: "Several markets,", text: "each with its own price." },
          ],
        },
        {
          id: "rest",
          audience: "For other plans",
          title: "Not on Plus",
          items: [
            {
              title: "A lighter version",
              text: "is possible with automatic discounts. Tell us what you need.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Does it work in several currencies?",
        answer:
          "Yes, where your payments setup supports local currencies. We check it with you on the first call.",
      },
      {
        question: "Is it in the Shopify App Store?",
        answer: "No. It is installed privately on your store and nobody else's.",
      },
      {
        question: "Can we change the tiers?",
        answer: "Yes. Names, prices, perks and rules are set up around your business.",
      },
    ],
  },

  gifts: {
    slug: "gifts",
    name: "Gifts",
    summary: "Free gifts and samples by product, quantity or cart total.",
    metaTitle: "Shopify Free Gift and Sample App",
    metaDescription:
      "Add a free gift or sample when a basket contains a product, reaches a quantity or passes a total. A private Shopify app, native to checkout.",
    enquiryArea: "Discounts and pricing",
    plan: "Shopify Plus",
    hero: {
      eyebrow: "Gifts",
      titleLines: [
        { text: "A free gift, added" },
        { text: "when the basket earns it.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Offer a sample or gift by product, by quantity or when the cart passes a total. It is added in the basket and priced by Shopify, with no workaround.",
      cta: "Ask about Gifts",
      imageAlt: "A phone showing a cart with a free gift line added above the order total.",
    },
    does: {
      title: "Gifts that follow your rules.",
      intro: "Three ways to earn one, all handled natively.",
      items: [
        {
          title: "By product",
          text: "Buy one item and a named sample comes with it.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "By quantity",
          text: "Buy three or more and a gift is added.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "By cart total",
          text: "Spend over a set amount and the gift is added automatically.",
          plans: "Plus",
          plusOnly: true,
        },
        {
          title: "Shown in the cart",
          text: "The gift appears as a line at zero, with the reason beside it.",
          plans: "Plus",
          plusOnly: true,
        },
      ],
    },
    screens: [
      { title: "Gift rules", text: "All your rules in one list, with stock remaining, dates and an on and off switch.", alt: "Admin list of gift rules by product, quantity and cart total with status, stock and dates." },
      { title: "Edit a rule", text: "Pick the trigger, the gift, a limit per order and the dates, and skip the gift when it is out of stock.", alt: "Admin form for a cart total gift rule with minimum total, gift product, usage limit and dates." },
      { title: "In the cart", text: "The gift appears in the basket at £0.00 with a note explaining why.", alt: "Storefront cart drawer with a free deodorant sample line and a message that a gift was added." },
      { title: "Gift report", text: "See gifts given, orders that included one and the effect on order value.", alt: "Admin report with gifts given, orders with a gift, average order value change and a weekly chart." },
    ],
    example: {
      title: "Spend £60 and the sample is yours.",
      text: "The basket passes the threshold, a deodorant sample is added, and the shopper sees why.",
      checks: [
        { title: "Added natively,", text: "so discounts and tax behave." },
        { title: "Limited by stock", text: "or date, as you choose." },
        { title: "Removed", text: "if the basket drops below the rule." },
      ],
      sceneLabel:
        "Example cart: a free sample added automatically after the basket passes £60.",
    },
    plans: {
      title: "Built for Plus.",
      intro: "Native gifts rely on Shopify Functions in a custom app, which needs Shopify Plus.",
      items: [
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          featured: true,
          items: [
            { title: "Gifts by rule,", text: "added and priced natively." },
            { title: "Your products,", text: "your thresholds." },
          ],
        },
        {
          id: "rest",
          audience: "For other plans",
          title: "Not on Plus",
          items: [
            {
              title: "A simpler approach",
              text: "may be possible with a built-in discount. Ask us.",
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can the gift be out of stock?",
        answer: "Yes. The rule can skip the gift when stock runs out.",
      },
      {
        question: "Can shoppers remove the gift?",
        answer: "They can remove it, and the rule only adds it again if you choose.",
      },
      {
        question: "Does the gift affect the order total?",
        answer: "It is added at zero, so the total reflects only what was paid for.",
      },
    ],
  },

  favourites: {
    slug: "favourites",
    name: "Favourites",
    summary: "Save for later, with a reminder that brings the basket back.",
    metaTitle: "Shopify Favourites and Wishlist App",
    metaDescription:
      "Let shoppers save products, then bring them back with a flow that ends in a pre-filled cart. A private Shopify app for any plan.",
    enquiryArea: "Storefront",
    plan: "All plans",
    hero: {
      eyebrow: "Favourites",
      titleLines: [
        { text: "Saved today," },
        { text: "bought on the way back.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Shoppers tap a heart to save a product. When they return, a flow reminds them, with a link that opens a cart already filled.",
      cta: "Ask about Favourites",
      imageAlt: "A phone showing a collection grid of products, each with a heart to save it.",
    },
    does: {
      title: "A wishlist that sells.",
      intro: "Saving is the start. Bringing them back is the point.",
      items: [
        {
          title: "Save in one tap",
          text: "A heart on every product card and page, kept for guests and customers.",
          plans: "All plans",
        },
        {
          title: "A favourites page",
          text: "Everything saved, in one place, in your theme's style.",
          plans: "All plans",
        },
        {
          title: "A retargeting flow",
          text: "Reminders to shoppers who saved something and left.",
          plans: "All plans",
        },
        {
          title: "Pre-filled cart link",
          text: "The reminder opens straight to checkout with their favourites in the cart.",
          plans: "All plans",
        },
      ],
    },
    screens: [
      { title: "The favourites page", text: "Shoppers see everything they saved in one place and can add it all to the cart.", alt: "Storefront favourites page with four saved products, heart icons and an add all to cart button." },
      { title: "Overview", text: "Products saved, shoppers with favourites and the revenue the reminders bring back.", alt: "Admin overview with saved products, shoppers with favourites, recovered revenue and a trend chart." },
      { title: "Reminder flow", text: "Choose the delay, connect your email tool and preview the cart link.", alt: "Admin flow editor: shopper saves a product, waits two days, receives an email with a pre-filled cart link." },
      { title: "The reminder email", text: "A short reminder with their saved items and a button that opens a filled cart.", alt: "Reminder email in an inbox with two saved products and a go to my cart button." },
    ],
    example: {
      title: "From a heart to a cart.",
      text: "A shopper saves two products and leaves. A reminder arrives with a link that opens a cart with both inside.",
      checks: [
        { title: "No sign-in", text: "needed to save." },
        { title: "Link opens", text: "a ready basket." },
        { title: "Works with", text: "the email tool you use." },
      ],
      sceneLabel:
        "Example flow: two saved products, a reminder, and a link that opens a cart with both.",
    },
    plans: {
      title: "Works on every plan.",
      intro: "Favourites sits in your theme and needs no Plus features.",
      items: [
        {
          id: "all",
          audience: "For any Shopify plan",
          title: "All plans",
          featured: true,
          items: [
            { title: "Storefront hearts", text: "and a favourites page." },
            { title: "Pre-filled cart", text: "links for your flows." },
          ],
        },
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          items: [
            { title: "The same app,", text: "with checkout touches if you want them." },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Which email tool does it work with?",
        answer: "The reminder is a link, so it works with Klaviyo, Shopify Email or any tool you use.",
      },
      {
        question: "Does it match our theme?",
        answer: "Yes. We style it to your theme during setup.",
      },
      {
        question: "Can guests save products?",
        answer: "Yes. Favourites are kept for guests, and carried over on sign-in.",
      },
    ],
  },

  assistant: {
    slug: "assistant",
    name: "AI assistant",
    summary: "Answers questions and recommends products, from your own catalogue.",
    metaTitle: "AI Shopping Assistant for Shopify",
    metaDescription:
      "An assistant that answers shopper questions and recommends products from your own catalogue. A private Shopify app for any plan.",
    enquiryArea: "AI features",
    plan: "All plans",
    hero: {
      eyebrow: "AI assistant",
      titleLines: [
        { text: "An assistant that knows" },
        { text: "your catalogue.", tone: "accent", italic: true, weight: "light" },
      ],
      lede: "Shoppers ask a question and get an answer with products to match. It draws on your catalogue and policies, and stays on your brand's voice.",
      cta: "Ask about the assistant",
      imageAlt:
        "A laptop showing a product page with a chat panel open, suggesting two matching products.",
    },
    does: {
      title: "Helpful, and honest about what it knows.",
      intro: "It answers from your store, not from guesswork.",
      items: [
        {
          title: "Answers questions",
          text: "Sizing, delivery, returns and care, taken from your own pages and policies.",
          plans: "All plans",
        },
        {
          title: "Recommends products",
          text: "Suggests items that fit what the shopper describes, with a link to buy.",
          plans: "All plans",
        },
        {
          title: "Your voice",
          text: "Tone and limits set up around your brand.",
          plans: "All plans",
        },
        {
          title: "Hands over to people",
          text: "Passes tricky questions to your team instead of guessing.",
          plans: "All plans",
        },
      ],
    },
    screens: [
      { title: "Knowledge", text: "Choose what the assistant knows: your catalogue, delivery, returns and sizing.", alt: "Admin knowledge tab listing the product catalogue, shipping, returns and sizing sources, all synced." },
      { title: "Conversations", text: "Read every conversation, and see which ones were handed to your team.", alt: "Admin conversation list and a transcript answering a delivery question for Ireland." },
      { title: "Tone and limits", text: "Set the voice, switch capabilities on or off and block topics, with a live preview.", alt: "Admin tone and limits page with brand voice, capability toggles, blocked topics and a live preview." },
      { title: "On the storefront", text: "Shoppers ask in plain words and get answers with products to match.", alt: "Chat widget on a kitchenware store, on laptop and phone, suggesting an enamel pot and a whisk set." },
    ],
    example: {
      title: "“Something for a small kitchen?”",
      text: "The assistant suggests two products that fit, explains why and links to each.",
      checks: [
        { title: "Grounded", text: "in your catalogue." },
        { title: "Stays within", text: "what you allow it to say." },
        { title: "Hands over", text: "when it isn't sure." },
      ],
      sceneLabel:
        "Example chat: a shopper asks for a gift for a small kitchen and the assistant suggests two products.",
    },
    plans: {
      title: "Works on every plan.",
      intro: "The assistant runs in your storefront and needs no Plus features.",
      items: [
        {
          id: "all",
          audience: "For any Shopify plan",
          title: "All plans",
          featured: true,
          items: [
            { title: "Questions and recommendations,", text: "on your storefront." },
            { title: "Set up", text: "around your catalogue and tone." },
          ],
        },
        {
          id: "plus",
          audience: "For Shopify Plus stores",
          title: "Shopify Plus",
          items: [
            { title: "The same assistant,", text: "extended across your stores." },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Can it make things up?",
        answer:
          "It answers from your catalogue and policies, and hands over when it cannot. We test it with you before launch.",
      },
      {
        question: "Where does the data go?",
        answer: "We explain the data handling on the first call, so you can check it suits you.",
      },
      {
        question: "Can we limit what it says?",
        answer: "Yes. Topics, tone and limits are set during setup.",
      },
    ],
  },
};

export const allProducts = productSlugs.map((slug) => products[slug]);
