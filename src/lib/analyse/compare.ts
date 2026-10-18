import type { Report } from "./report";

type App = Report["apps"][number];

export type CompareRow = {
  label: string;
  you: string;
  them: string;
  /** Who is ahead, where "ahead" means something. */
  lead: "you" | "them" | null;
};

export type SuggestionId = "membership" | "gifts" | "favourites" | "assistant" | "custom";

export type Suggestion = {
  id: SuggestionId;
  title: string;
  reason: string;
  href: string;
  cta: string;
};

export type Comparison = {
  rows: CompareRow[];
  apps: { onlyYou: App[]; onlyThem: App[]; both: App[] };
  suggestions: Suggestion[];
};

const fmt = (n: number) => n.toLocaleString("en-GB");
const weightKb = (r: Report) => r.storefront.hosts.reduce((total, host) => total + host.kb, 0);
const names = (apps: App[]) => {
  const shown = apps.slice(0, 3).map((app) => app.name);
  return apps.length > 3 ? `${shown.join(", ")} and ${apps.length - 3} more` : shown.join(", ");
};
const inCategory = (r: Report, ...categories: string[]) =>
  r.apps.filter((app) => categories.includes(app.category));

const planLabel = { plus: "Likely Plus", standard: "Likely standard", unknown: "Can't tell" } as const;

/** Higher wins, unless they are within 10% of each other. */
function higher(you: number, them: number): CompareRow["lead"] {
  if (Math.abs(you - them) <= Math.max(you, them) * 0.1) return null;
  return you > them ? "you" : "them";
}

export function compare(you: Report, them: Report): Comparison {
  const youKb = weightKb(you);
  const themKb = weightKb(them);
  const sameCurrency = you.store.currency === them.store.currency;

  const rows: CompareRow[] = [
    {
      label: "Products",
      you: fmt(you.catalogue.products),
      them: fmt(them.catalogue.products),
      lead: higher(you.catalogue.products, them.catalogue.products),
    },
    {
      label: "Collections",
      you: fmt(you.catalogue.collections),
      them: fmt(them.catalogue.collections),
      lead: higher(you.catalogue.collections, them.catalogue.collections),
    },
    {
      label: "Variants",
      you: fmt(you.catalogue.variants),
      them: fmt(them.catalogue.variants),
      lead: null,
    },
    {
      label: "Average price",
      you: `${you.store.currency} ${fmt(Math.round(you.catalogue.averagePrice))}`,
      them: `${them.store.currency} ${fmt(Math.round(them.catalogue.averagePrice))}`,
      lead: null,
    },
    {
      label: "Apps detected",
      you: fmt(you.apps.length),
      them: fmt(them.apps.length),
      lead: null,
    },
    {
      label: "Third-party script weight",
      you: `${fmt(youKb)} KB`,
      them: `${fmt(themKb)} KB`,
      // Lighter is better
      lead: Math.abs(youKb - themKb) <= Math.max(youKb, themKb) * 0.1 ? null : youKb < themKb ? "you" : "them",
    },
    {
      label: "Plan estimate",
      you: planLabel[you.plan.verdict],
      them: planLabel[them.plan.verdict],
      lead: null,
    },
    {
      label: "Theme",
      you: you.store.theme.name,
      them: them.store.theme.name,
      lead: null,
    },
    {
      label: "Currencies",
      you: fmt(you.store.markets.length),
      them: fmt(them.store.markets.length),
      lead: higher(you.store.markets.length, them.store.markets.length),
    },
    {
      label: "Languages",
      you: fmt(you.store.languages.length),
      them: fmt(them.store.languages.length),
      lead: higher(you.store.languages.length, them.store.languages.length),
    },
    {
      label: "Payment methods",
      you: fmt(you.store.payments.length),
      them: fmt(them.store.payments.length),
      lead: higher(you.store.payments.length, them.store.payments.length),
    },
  ];
  // Script weight reads 0 when a store's scripts couldn't be sized: say nothing rather than a tie at zero
  if (youKb === 0 && themKb === 0) rows.splice(rows.findIndex((row) => row.label === "Third-party script weight"), 1);
  if (!sameCurrency) rows.find((row) => row.label === "Average price")!.lead = null;

  const yourNames = new Set(you.apps.map((app) => app.name));
  const theirNames = new Set(them.apps.map((app) => app.name));
  const apps = {
    onlyYou: you.apps.filter((app) => !theirNames.has(app.name)),
    onlyThem: them.apps.filter((app) => !yourNames.has(app.name)),
    both: you.apps.filter((app) => theirNames.has(app.name)),
  };

  const suggestions: Suggestion[] = [];
  const gap = (...categories: string[]) => {
    const theirs = inCategory(them, ...categories);
    return theirs.length > 0 && inCategory(you, ...categories).length === 0 ? theirs : null;
  };

  const retention = gap("Subscriptions", "Loyalty and referrals");
  if (retention) {
    suggestions.push({
      id: "membership",
      title: "Membership",
      reason: `${them.store.name} runs ${names(retention)} to keep customers coming back, and we found nothing like it on ${you.store.name}. Membership gives you member prices at checkout and tiers priced per market.`,
      href: "/products/membership",
      cta: "See Membership",
    });
  }

  const wishlist = gap("Wishlists and favourites");
  if (wishlist) {
    suggestions.push({
      id: "favourites",
      title: "Favourites",
      reason: `${them.store.name} lets shoppers save products (${names(wishlist)}). Favourites does that, then brings shoppers back with a reminder that opens a filled cart.`,
      href: "/products/favourites",
      cta: "See Favourites",
    });
  }

  const support = gap("Customer support");
  if (support) {
    suggestions.push({
      id: "assistant",
      title: "AI assistant",
      reason: `${them.store.name} offers chat (${names(support)}); we found none on ${you.store.name}. The assistant answers questions and recommends products from your own catalogue.`,
      href: "/products/assistant",
      cta: "See the assistant",
    });
  }

  const upsell = gap("Upsell and bundles");
  if (upsell) {
    suggestions.push({
      id: "gifts",
      title: "Gifts",
      reason: `${them.store.name} uses ${names(upsell)} to lift basket size. Gifts adds a free gift or sample by product, quantity or cart total, natively at checkout.`,
      href: "/products/gifts",
      cta: "See Gifts",
    });
  }

  if (youKb - themKb >= 50 && youKb > themKb * 1.3) {
    suggestions.push({
      id: "custom",
      title: "Lighter pages",
      reason: `${you.store.name} loads ${fmt(youKb)} KB of third-party scripts against ${fmt(themKb)} KB. One purpose-built app can replace several overlapping ones and load only where it is used.`,
      href: "/#enquire",
      cta: "Talk about it",
    });
  }

  if (!suggestions.some((s) => s.id === "custom")) {
    suggestions.push({
      id: "custom",
      title: suggestions.length ? "Something that fits neither" : "Something no app does",
      reason: suggestions.length
        ? "If your gap isn't one of these, we build it as a private app for that one job: fixed price, and the code is yours."
        : `We found no obvious gap between the two stores from outside. If something your store needs isn't in any app, we build it as a private app: fixed price, and the code is yours.`,
      href: "/#enquire",
      cta: "Begin a conversation",
    });
  }

  return { rows, apps, suggestions };
}
