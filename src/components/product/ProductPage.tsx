import type { StaticImageData } from "next/image";
import assistant from "@/assets/images/products/assistant.webp";
import favourites from "@/assets/images/products/favourites.webp";
import gifts from "@/assets/images/products/gifts.webp";
import membership from "@/assets/images/products/membership.webp";
import { PlanCard, PlanGrid, Scene, ServiceList, StepList } from "@/components/blocks";
import { LandingHero } from "@/components/landing/LandingHero";
import { Faq } from "@/components/landing/Faq";
import { MotionStart } from "@/components/motion";
import { Enquiry } from "@/components/sections";
import {
  Button,
  CheckList,
  Eyebrow,
  Heading,
  Section,
  SectionHeader,
  Split,
  Stack,
  Text,
} from "@/components/ui";
import { productCopy, type Product, type ProductSlug } from "@/content/products";
import { ProductScreens } from "./ProductScreens";
import { scenes } from "./scenes";
import styles from "./Product.module.css";

export const productImages: Record<ProductSlug, StaticImageData> = {
  membership,
  gifts,
  favourites,
  assistant,
};

/** One ready-made product: hero, what it does, how it arrives, plans, questions, enquiry. */
export function ProductPage({ product }: { product: Product }) {
  const scene = scenes[product.slug as ProductSlug];
  return (
    <>
      <LandingHero
        landing={product}
        image={productImages[product.slug as ProductSlug]}
        cards={{ a: scene.heroA, b: scene.heroB }}
      />

      <Section labelledBy="screens-title">
        <SectionHeader
          eyebrow={productCopy.screensEyebrow}
          title={productCopy.screensTitle}
          titleId="screens-title"
          intro={productCopy.screensIntro}
        />
        <ProductScreens product={product} />
      </Section>

      <Section labelledBy="does-title" spacing="flush-top">
        <SectionHeader
          eyebrow={productCopy.doesEyebrow}
          title={product.does.title}
          titleId="does-title"
          intro={product.does.intro}
        />
        <ServiceList items={product.does.items} />
      </Section>

      <Section labelledBy="example-title" tone="raised" bordered>
        <Split ratio="5:6" align="center">
          <Stack gap="6">
            <Eyebrow>{productCopy.exampleEyebrow}</Eyebrow>
            <Heading id="example-title" reveal>
              {product.example.title}
            </Heading>
            <Text size="lg" measure="narrow">
              {product.example.text}
            </Text>
            <CheckList items={product.example.checks} />
          </Stack>
          <Scene label={product.example.sceneLabel} background="rings">
            {scene.example}
          </Scene>
        </Split>
      </Section>

      <Section labelledBy="how-title">
        <Stack gap="6">
          <Eyebrow>{productCopy.trustEyebrow}</Eyebrow>
          <Heading id="trust-title" reveal>
            {productCopy.trustTitle}
          </Heading>
          <CheckList items={productCopy.trust} />
        </Stack>
      </Section>

      <Section labelledBy="how-title" spacing="flush-top">
        <SectionHeader eyebrow={productCopy.howEyebrow} title="Installed for you." titleId="how-title" />
        <StepList steps={productCopy.steps} />
      </Section>

      <Section labelledBy="plans-title" spacing="flush-top">
        <SectionHeader
          eyebrow={productCopy.planEyebrow}
          title={product.plans.title}
          titleId="plans-title"
          intro={product.plans.intro}
        />
        <PlanGrid>
          {product.plans.items.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </PlanGrid>
        <p className={styles.price}>{productCopy.pricing}</p>
      </Section>

      <Section labelledBy="faq-title" spacing="flush-top">
        <Split ratio="4:8">
          <Stack gap="6">
            <Eyebrow>{productCopy.faqEyebrow}</Eyebrow>
            <Heading id="faq-title" reveal>
              {productCopy.faqTitle}
            </Heading>
          </Stack>
          <Faq items={product.faq} />
        </Split>
      </Section>

      <Section labelledBy="custom-title" tone="raised" bordered>
        <Stack gap="6">
          <Heading id="custom-title" reveal>
            {productCopy.customTitle}
          </Heading>
          <Text size="lg" measure="narrow">
            {productCopy.customText}
          </Text>
          <div>
            <Button href="/#build" variant="ghost">
              {productCopy.customCta}
            </Button>
          </div>
        </Stack>
      </Section>

      <Enquiry defaultAreas={[product.enquiryArea]} />
      <MotionStart />
    </>
  );
}
