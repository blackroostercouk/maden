/**
 * Breakpoints in pixels. Mirror of src/styles/tokens/media.css,
 * for the rare cases JavaScript needs them (e.g. matchMedia).
 */
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 900,
  lg: 1080,
  xl: 1700,
  "2xl": 2100,
  "3xl": 2500,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaQuery = {
  down: (bp: Breakpoint) => `(max-width: ${breakpoints[bp]}px)`,
  up: (bp: Breakpoint) => `(min-width: ${breakpoints[bp]}px)`,
  reducedMotion: "(prefers-reduced-motion: reduce)",
  finePointer: "(pointer: fine)",
} as const;
