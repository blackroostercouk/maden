import type { StaticImageData } from "next/image";
import b2bBand from "@/assets/images/landing/b2b-band.webp";
import b2bSplit from "@/assets/images/landing/b2b-split.webp";
import checkoutScene from "@/assets/images/landing/checkout-scene.webp";
import checkoutSplit from "@/assets/images/landing/checkout-split.webp";
import config1 from "@/assets/images/landing/config-1.webp";
import config2 from "@/assets/images/landing/config-2.webp";
import config3 from "@/assets/images/landing/config-3.webp";
import erpBand from "@/assets/images/landing/erp-band.webp";
import memberScene from "@/assets/images/landing/member-scene.webp";
import memberSplit from "@/assets/images/landing/member-split.webp";
import pricingBand from "@/assets/images/landing/pricing-band.webp";
import pricingScene from "@/assets/images/landing/pricing-scene.webp";
import type { LandingSlug } from "@/content/landings";

type Picture = { image: StaticImageData; alt: string; position?: string };

/**
 * What makes each landing page its own. Every page shares the same spine
 * (hero, problem, what we build, example, plans, questions, process, form);
 * this decides the pictures and layouts that change between them.
 */
export type LandingRecipe = {
  /** grid: three cards side by side. split: a tall photograph beside stacked cards. */
  problem: { layout: "grid" } | { layout: "split"; picture: Picture };
  /** A full-width photograph with a line of text over it. */
  band?: { picture: Picture; after: "problem" | "build" };
  /** Three photographs, each with a caption, after the build list. */
  gallery?: Picture[];
  /** Photograph behind the example cards. Omit for the green rings. */
  exampleBackground?: Picture;
};

export const recipes: Record<LandingSlug, LandingRecipe> = {
  // Precise and analytical: a band of price-tagged knitwear, rules over a desk of tags and swatches
  "pricing-and-discounts": {
    problem: { layout: "grid" },
    band: {
      after: "problem",
      picture: {
        image: pricingBand,
        alt: "A rail of wool jumpers in charcoal, sage and oat, each with a handwritten price tag.",
      },
    },
    exampleBackground: {
      image: pricingScene,
      alt: "A slate desk with a leather tag, fountain pen, measuring tape and folded fabric swatches.",
    },
  },

  // The moment of purchase: gift wrapping beside the problem, a dispatch desk behind the cards
  "checkout-customisation": {
    problem: {
      layout: "split",
      picture: {
        image: checkoutSplit,
        alt: "Hands tying twine around a kraft-paper gift with a sprig of eucalyptus and a handwritten tag.",
      },
    },
    exampleBackground: {
      image: checkoutScene,
      alt: "A dispatch desk with a calendar, wrapped parcels and a brass lamp.",
    },
  },

  // Operations: a dispatch office above the warehouse floor, technical cards on the green rings
  "erp-and-warehouse-integrations": {
    problem: { layout: "grid" },
    band: {
      after: "build",
      picture: {
        image: erpBand,
        alt: "A dispatch office with two monitors, looking out over a warehouse floor at night.",
      },
    },
  },

  // Relationships: a showroom shelf beside the problem, a long sample table as a band
  "b2b-and-wholesale": {
    problem: {
      layout: "split",
      picture: {
        image: b2bSplit,
        alt: "Folded linen and wool on showroom shelves, with a leather order book and brass pen in front.",
      },
    },
    band: {
      after: "build",
      picture: {
        image: b2bBand,
        alt: "A wholesale showroom with a long table of fabric and ceramic samples laid out in rows.",
      },
    },
  },

  // Craft and personal choice: three photographs of making it your own
  "product-configurators": {
    problem: { layout: "grid" },
    gallery: [
      {
        image: config1,
        alt: "Speckled glaze test tiles in sage, oat, navy and clay beside a notebook and pencil.",
      },
      {
        image: config2,
        alt: "Three stoneware mugs in sage, oat and navy glazes, each with a kraft tag.",
      },
      {
        image: config3,
        alt: "A personalised stoneware mug in a kraft gift box with green tissue and a tag.",
      },
    ],
  },

  // Ongoing relationship: the box arriving, and the box opened at home
  "membership-and-subscriptions": {
    problem: {
      layout: "split",
      picture: {
        image: memberSplit,
        alt: "A dark green delivery box on a front doorstep at dusk with a membership card on top.",
      },
    },
    exampleBackground: {
      image: memberScene,
      alt: "An open members' box with tissue paper, a card and a candle on a coffee table in the evening.",
    },
  },
};

export type { Picture };
