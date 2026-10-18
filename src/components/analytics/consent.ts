/**
 * The visitor's cookie choice, kept in this browser only. Nothing that sets a
 * cookie (Google Analytics) loads until the choice is "granted".
 */
export type Consent = "granted" | "denied" | null;

const KEY = "moden-consent";
const listeners = new Set<() => void>();
let asking = false;

export function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

const emit = () => listeners.forEach((listener) => listener());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Whether to show the banner: no choice yet, or the visitor asked to change it. */
export const isAsking = () => asking || readConsent() === null;

export function reopenConsent() {
  asking = true;
  emit();
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
    }
  }
}

export function setConsent(choice: "granted" | "denied") {
  const before = readConsent();
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    // Storage blocked: the choice lasts for this page view only
  }
  asking = false;
  if (choice === "denied" && before === "granted") {
    // Analytics is already running on this page, so stop it by reloading without it
    clearAnalyticsCookies();
    location.reload();
    return;
  }
  emit();
}
