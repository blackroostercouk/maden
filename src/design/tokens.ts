/**
 * Typed names for the design tokens in src/styles/tokens.
 * Components take these names as props, so only real tokens can be used.
 */

export const fontSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"] as const;
export type FontSize = (typeof fontSizes)[number];

export type FontFamily = "display" | "body";
export type FontWeight = "light" | "book" | "regular" | "medium" | "semibold";

export type TextTone = "default" | "muted" | "soft" | "accent" | "danger";

export type Measure = "narrow" | "default" | "wide" | "none";

export type SpaceToken =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "stack-fluid"
  | "column-fluid"
  | "grid-fluid";

/**
 * Page background as a literal, for places CSS variables cannot reach
 * (the theme-color meta tag). Mirrors --color-bg in styles/tokens/color.css.
 */
export const themeColor = "#0e110f";

/** Read a CSS custom property at runtime (client only). */
export function readToken(name: `--${string}`, element: Element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

/** Build a var() reference for a space token. */
export const space = (token: SpaceToken) => `var(--space-${token})`;
