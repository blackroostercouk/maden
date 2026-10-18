/**
 * Enquiry rules shared by the form (instant feedback) and the API route
 * (the check that counts). Allowed choices come from the site content.
 */
import { enquiry as copy } from "@/content/site";

export type Enquiry = {
  name: string;
  email: string;
  brand: string;
  store: string;
  plan: string;
  areas: string[];
  brief: string;
  budget: string;
  timing: string;
};

export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

/** Hidden form field that only bots fill in. */
export const HONEYPOT_FIELD = "website";

const LIMITS = { short: 200, brief: 5000, briefMin: 20 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Control characters except tab and newline (\r goes too, normalising line endings)
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f]/g;
const LINE_BREAKS = /[\r\n\t]+/g;

export const emptyEnquiry: Enquiry = {
  name: "",
  email: "",
  brand: "",
  store: "",
  plan: "",
  areas: [],
  brief: "",
  budget: "",
  timing: "",
};

export function validateEnquiry(input: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!input.name.trim()) errors.name = "Add your name so we know who to reply to.";
  if (!EMAIL.test(input.email.trim()))
    errors.email = "Enter an email address like name@yourbrand.com.";
  if (!input.plan) errors.plan = "Choose your Shopify plan, or pick Not sure.";
  if (input.brief.trim().length < LIMITS.briefMin)
    errors.brief = "Describe the app in at least a sentence or two (20 characters or more).";
  if (input.brief.length > LIMITS.brief)
    errors.brief = `Keep the description under ${LIMITS.brief.toLocaleString("en-GB")} characters.`;
  return errors;
}

/** Single-line text: no control characters or line breaks (these end up in email subjects). */
const str = (value: unknown, max: number = LIMITS.short) =>
  typeof value === "string"
    ? value.replace(CONTROL, "").replace(LINE_BREAKS, " ").trim().slice(0, max)
    : "";

/** Multi-line text: keeps line breaks, drops other control characters. */
const multiline = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(CONTROL, "").trim().slice(0, max) : "";

const oneOf = (value: unknown, allowed: readonly string[]) =>
  typeof value === "string" && allowed.includes(value) ? value : "";

/** Turn untrusted JSON into a clean Enquiry, dropping anything unexpected. */
export function sanitiseEnquiry(raw: unknown): Enquiry {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const allowedAreas: readonly string[] = copy.areas;
  const areas = Array.isArray(body.areas)
    ? body.areas.filter(
        (area): area is string => typeof area === "string" && allowedAreas.includes(area),
      )
    : [];
  return {
    name: str(body.name),
    email: str(body.email),
    brand: str(body.brand),
    store: str(body.store),
    plan: oneOf(body.plan, copy.plans),
    areas: [...new Set(areas)],
    brief: multiline(body.brief, LIMITS.brief + 1),
    budget: oneOf(body.budget, copy.budgets),
    timing: oneOf(body.timing, copy.timings),
  };
}

/** Plain-text version for copying into an email. */
export function formatEnquiry(data: Enquiry) {
  const optional = (label: string, value: string) => (value ? `${label}: ${value}` : null);
  return [
    "New app enquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    optional("Brand", data.brand),
    optional("Store", data.store),
    `Plan: ${data.plan}`,
    optional("Areas", data.areas.join(", ")),
    optional("Budget", data.budget),
    optional("Timing", data.timing),
    "",
    "What the app should do:",
    data.brief,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
