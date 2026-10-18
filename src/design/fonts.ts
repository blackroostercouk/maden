import { Manrope } from "next/font/google";
import localFont from "next/font/local";

/**
 * Self-hosted variable fonts. Each one exposes a CSS variable that the
 * typography tokens build on (see src/styles/tokens/typography.css).
 */
export const bodoni = localFont({
  src: [
    { path: "../assets/fonts/bodoni-moda-latin-opsz-normal.woff2", style: "normal" },
    { path: "../assets/fonts/bodoni-moda-latin-opsz-italic.woff2", style: "italic" },
  ],
  weight: "400 900",
  display: "swap",
  variable: "--font-bodoni",
  // Metric-matched fallback while the font loads. The full fallback
  // stack lives in the --font-display token (quoted, so it stays valid).
  adjustFontFallback: "Times New Roman",
});

export const hanken = localFont({
  src: [{ path: "../assets/fonts/hanken-grotesk-latin-wght-normal.woff2", style: "normal" }],
  weight: "100 900",
  display: "swap",
  variable: "--font-hanken",
  adjustFontFallback: "Arial",
});

/**
 * Manrope, a sans-serif, used for display type while we compare it with
 * Bodoni Moda. Next downloads it at build time and serves it from our own
 * domain. To go back to Bodoni, point --font-display at --font-bodoni.
 */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});
