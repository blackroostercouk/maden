import type { StaticImageData } from "next/image";
import b2b from "@/assets/images/landing-b2b.webp";
import checkout from "@/assets/images/landing-checkout.webp";
import configurator from "@/assets/images/landing-configurator.webp";
import integrations from "@/assets/images/landing-integrations.webp";
import membership from "@/assets/images/landing-membership.webp";
import pricing from "@/assets/images/landing-pricing.webp";
import { PlanCard, PlanGrid, PrincipleList, Scene, ServiceList } from "@/components/blocks";
import { MotionStart } from "@/components/motion";
import { Enquiry, Process } from "@/components/sections";
import {
  CheckList,
  Eyebrow,
  Heading,
  Photo,
  Section,
  SectionHeader,
  Split,
  Stack,
  Text,
} from "@/components/ui";
import { landingCopy, type Landing, type LandingSlug } from "@/content/landings";
import { Faq } from "./Faq";
import { LandingBand } from "./LandingBand";
import { LandingGallery } from "./LandingGallery";
import { LandingHero } from "./LandingHero";
import { recipes } from "./media";
import { scenes } from "./scenes";
import styles from "./LandingPage.module.css";

const images: Record<LandingSlug, StaticImageData> = {
  "pricing-and-discounts": pricing,
  "checkout-customisation": checkout,
  "erp-and-warehouse-integrations": integrations,
  "b2b-and-wholesale": b2b,
  "product-configurators": configurator,
  "membership-and-subscriptions": membership,
};

/**
 * One landing page. The sections come in the same order for every kind of
 * commission; the recipe in media.ts decides which pictures and layouts each
 * page adds, so they read as different pages rather than copies.
 */
export function LandingPage({ landing }: { landing: Landing }) {
  const slug = landing.slug as LandingSlug;
  const scene = scenes[slug];
  const recipe = recipes[slug];
  const { problem, band, gallery } = landing;

  const bandBlock =
    band && recipe.band ? (
      <LandingBand picture={recipe.band.picture} eyebrow={band.eyebrow} title={band.title} />
    ) : null;
  const bandAfterProblem = recipe.band?.after === "problem";
  const bandAfterBuild = recipe.band?.after === "build";

  return (
    <>
      <LandingHero
        landing={landing}
        image={images[slug]}
        cards={{ a: scene.heroA, b: scene.heroB }}
      />

      {recipe.problem.layout === "split" ? (
        <Section labelledBy="problem-title">
          <Split ratio="5:6" align="start" reverseOnStack>
            <div className={styles.stickyPhoto}>
              <Photo
                src={recipe.problem.picture.image}
                alt={recipe.problem.picture.alt}
                aspect="4 / 5"
                parallax
                sizes="(max-width: 900px) 100vw, 45vw"
                objectPosition={recipe.problem.picture.position}
              />
            </div>
            <Stack gap="8">
              <SectionHeader
                eyebrow={problem.eyebrow}
                title={problem.title}
                titleId="problem-title"
                intro={problem.intro}
                layout="stacked"
              />
              <PrincipleList items={problem.items} />
            </Stack>
          </Split>
        </Section>
      ) : (
        <Section labelledBy="problem-title">
          <SectionHeader
            eyebrow={problem.eyebrow}
            title={problem.title}
            titleId="problem-title"
            intro={problem.intro}
          />
          <PrincipleList items={problem.items} layout="grid" />
        </Section>
      )}

      {bandAfterProblem && bandBlock}

      <Section labelledBy="build-title" spacing={bandAfterProblem ? "default" : "flush-top"}>
        <SectionHeader
          eyebrow={landing.build.eyebrow}
          title={landing.build.title}
          titleId="build-title"
          intro={landing.build.intro}
        />
        <ServiceList items={landing.build.items} />
      </Section>

      {bandAfterBuild && bandBlock}

      {gallery && recipe.gallery && (
        <Section labelledBy="gallery-title" spacing="flush-top">
          <LandingGallery
            pictures={recipe.gallery}
            captions={gallery.captions}
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            intro={gallery.intro}
          />
        </Section>
      )}

      <Section labelledBy="example-title" tone="raised" bordered>
        <Split ratio="5:6" align="center">
          <Stack gap="6">
            <Eyebrow>{landing.example.eyebrow}</Eyebrow>
            <Heading id="example-title" reveal>
              {landing.example.title}
            </Heading>
            <Text size="lg" measure="narrow">
              {landing.example.text}
            </Text>
            <CheckList items={landing.example.checks} />
          </Stack>
          <Scene
            label={landing.example.sceneLabel}
            background={
              recipe.exampleBackground
                ? {
                    image: recipe.exampleBackground.image,
                    position: recipe.exampleBackground.position,
                  }
                : "rings"
            }
          >
            {scene.example}
          </Scene>
        </Split>
      </Section>

      <Section labelledBy="plans-title">
        <SectionHeader
          eyebrow={landing.plans.eyebrow}
          title={landing.plans.title}
          titleId="plans-title"
          intro={landing.plans.intro}
        />
        <PlanGrid>
          {landing.plans.items.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </PlanGrid>
      </Section>

      <Section labelledBy="faq-title" spacing="flush-top">
        <Split ratio="4:8">
          <Stack gap="6">
            <Eyebrow>{landingCopy.faqEyebrow}</Eyebrow>
            <Heading id="faq-title" reveal>
              {landingCopy.faqTitle}
            </Heading>
          </Stack>
          <Faq items={landing.faq} />
        </Split>
      </Section>

      <Process />
      <Enquiry defaultAreas={[landing.enquiryArea]} />
      <MotionStart />
    </>
  );
}
