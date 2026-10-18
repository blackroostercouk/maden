# Moden

Marketing site for a studio that builds tailor-made, turnkey Shopify apps.
Next.js 16 (App Router, Turbopack), TypeScript, CSS Modules, GSAP + Lenis, three.js.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                 | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Development server with hot reload          |
| `npm run build`        | Production build                            |
| `npm start`            | Serve the production build                  |
| `npm run format`       | Format everything with Prettier             |
| `npm run format:check` | Fail if anything is not formatted           |
| `npm run lint`         | ESLint (Next.js rules, Prettier-compatible) |
| `npm run typecheck`    | TypeScript, no output                       |
| `npm test`             | Unit tests (Vitest)                         |
| `npm run check`        | format:check + lint + typecheck + test (CI) |

Requires Node.js 22.12 or newer.

## Project structure

```
src/
├── app/                  Routes: layout, page, /api/enquiries
├── assets/               Fonts (self-hosted) and photography
├── content/site.ts       Every word on the site, in one file
├── design/               Typed mirrors of the tokens for TypeScript
│   ├── tokens.ts           prop types (FontSize, TextTone, SpaceToken…)
│   ├── breakpoints.ts      breakpoint values + media query helpers
│   ├── motion.ts           GSAP durations, easings, staggers
│   └── fonts.ts            next/font setup
├── styles/
│   ├── tokens/           THE design system (see below)
│   ├── base.css          element defaults, built from tokens
│   └── utilities.css     sr-only, skip link
├── lib/                  cx(), enquiry validation
│   └── server/             enquiry delivery, rate limit (API only)
└── components/
    ├── ui/               Primitives: Heading, Text, Button, Section…
    ├── form/             Field, TextInput, TextArea, Select, ChoiceGroup
    ├── mock/             Interface illustrations: MockCard, Pill, Phone…
    ├── blocks/           Composites: Scene, CompareTable, StepList…
    ├── layout/           SiteHeader, SiteFooter
    ├── motion/           MotionProvider, animations, WeaveCanvas
    └── sections/         Page sections, composed from the layers above
```

Layers only depend downwards: `sections → blocks → ui / mock / form → tokens`.
Every component lives in its own folder with `Name.tsx`, `Name.module.css`
and `index.ts`.

## Design tokens

All visual values live in `src/styles/tokens/` as CSS custom properties.
Components never use raw colours, sizes or spacing; they use tokens.

| File             | Contains                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `color.css`      | `--palette-*` raw values, `--color-*` semantic roles                                          |
| `typography.css` | `--font-*` families, `--font-size-xs…5xl`, weights, line heights, letter spacing, `--measure` |
| `spacing.css`    | `--space-1…16` (4px scale), `--space-*-fluid` layout rhythm, page gutters                     |
| `layout.css`     | `--width-*`, `--height-*`, `--radius-*`, borders, `--z-*` stacking                            |
| `effects.css`    | `--shadow-*`, blur, `--ease-*`, `--duration-*`                                                |
| `media.css`      | Breakpoints as `@custom-media` (`--bp-md-down`, `--bp-xl-up`…)                                |

Rules:

1. **Colour:** components use `--color-*` only. `--palette-*` exists to feed
   the semantic layer. Re-theme by changing the semantic layer.
2. **Type:** use the `Heading` and `Text` components with `size`, `tone` and
   `measure` props. The type scale is fluid and keeps growing on wide
   screens.
3. **Spacing:** fixed `--space-*` for component internals, `--space-*-fluid`
   between blocks and sections. `Section` applies section rhythm for you.
4. **Breakpoints:** write `@media (--bp-md-down) { … }` in any CSS file.
   PostCSS compiles it (see `postcss.config.mjs`).
5. **Motion:** GSAP values come from `src/design/motion.ts`.

## Components at a glance

```tsx
<Section id="plans" labelledBy="plans-title" spacing="flush-top">
  <SectionHeader eyebrow="Plans" title="Built for Shopify Plus." titleId="plans-title" intro="…" />
  <Split ratio="5:6" align="center">
    <Stack gap="6">
      <Heading size="2xl" reveal>
        Measured, cut and fitted.
      </Heading>
      <Text tone="muted" measure="narrow">
        …
      </Text>
      <Button href="#enquire" withArrow>
        Start an enquiry
      </Button>
    </Stack>
    <Scene label="Describe the illustration for screen readers">
      <MockCard width="lg" float>
        …
      </MockCard>
    </Scene>
  </Split>
</Section>
```

## Motion

`MotionProvider` (in the root layout) starts Lenis and GSAP after the page
is interactive. Components opt in with data attributes, documented at the
top of `src/components/motion/animations.ts`, for example
`data-reveal="words"`, `data-parallax`, `data-count-to`. Content is always
visible without JavaScript, and under `prefers-reduced-motion` nothing
animates.

## Enquiries

The form posts to `/api/enquiries`, which validates with the same rules as
the form (`src/lib/enquiry.ts`) and hands the enquiry to
`src/lib/server/deliverEnquiry.ts`.

Copy `.env.example` to `.env.local` (or set the variables on your host):

| Variable             | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `RESEND_API_KEY`     | API key from [Resend](https://resend.com)            |
| `ENQUIRY_TO_EMAIL`   | Where enquiries go; comma-separate several addresses |
| `ENQUIRY_FROM_EMAIL` | Sender on a domain verified in Resend                |

With all three set, each enquiry is emailed to the studio with the sender
as reply-to. Without them, development appends to `.data/enquiries.ndjson`
and production answers with an error (logged on the server) so the visitor
sees the copy-and-email fallback instead of losing their enquiry.

The route only accepts same-origin JSON up to 16 KB, drops submissions
that fill the hidden `website` field, and allows five enquiries per
address every ten minutes. That limit is held in memory per server
instance; back it with a shared store if you need a hard limit.

## Security headers

`next.config.ts` sends a Content Security Policy (without nonces, so the
home page stays static), HSTS, `X-Frame-Options`, `nosniff`, a referrer
policy and a permissions policy on every route. If you add third-party
scripts, analytics or embeds, add their origins to the policy.

## Assets

Photography was generated for this project and is free to use here. Fonts
are Bodoni Moda and Hanken Grotesk, both under the SIL Open Font License
(see `src/assets/fonts/`).
