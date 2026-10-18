/**
 * Motion tokens for GSAP. Durations in seconds, mirrored from
 * src/styles/tokens/effects.css where they overlap.
 */
export const duration = {
  fast: 0.7,
  base: 0.9,
  slow: 1.1,
  slower: 1.3,
  intro: 1.6,
} as const;

export const ease = {
  out: "expo.out",
  soft: "power3.out",
  inOut: "expo.inOut",
  linear: "none",
} as const;

export const stagger = {
  words: 0.045,
  heroWords: 0.07,
  items: 0.09,
  rows: 0.15,
  cards: 0.25,
} as const;

/** Where a ScrollTrigger reveal starts, as "element viewport" pairs. */
export const revealStart = {
  early: "top 92%",
  default: "top 85%",
  late: "top 78%",
} as const;

export const smoothScroll = {
  duration: 1.15,
  headerOffset: -76,
} as const;
