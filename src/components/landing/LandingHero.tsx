import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { WeaveCanvas } from "@/components/motion";
import { Backdrop, Button, Container, Eyebrow, Heading, Photo, Text } from "@/components/ui";
import { landingCopy, type Landing } from "@/content/landings";
import styles from "./LandingHero.module.css";

type LandingHeroProps = {
  landing: Pick<Landing, "hero">;
  image: StaticImageData;
  cards: { a: ReactNode; b: ReactNode };
};

/** The opening of a landing page: headline and call to action beside a photograph with two floating cards. */
export function LandingHero({ landing, image, cards }: LandingHeroProps) {
  const { hero } = landing;
  return (
    <section className={styles.hero} aria-labelledby="landing-title" data-pointer-scope>
      <Backdrop pattern="weave" />
      <WeaveCanvas />
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <div data-intro="0.3">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>
          <Heading
            as="h1"
            id="landing-title"
            size="2xl"
            weight="semibold"
            lines={hero.titleLines}
            intro
          />
          <div data-intro="0.55">
            <Text size="md" tone="soft" measure="narrow">
              {hero.lede}
            </Text>
          </div>
          <div className={styles.ctas} data-intro="0.7">
            <Button href="#enquire" withArrow>
              {hero.cta}
            </Button>
            <Button href="#process" variant="ghost">
              {landingCopy.secondaryCta}
            </Button>
          </div>
        </div>

        <div className={styles.stage} role="img" aria-label={hero.imageAlt}>
          <div className={styles.photo} data-intro-clip>
            <Photo src={image} alt="" priority scrim sizes="(max-width: 900px) 100vw, 55vw" />
          </div>
          <div className={styles.cardA} data-intro="0.95">
            {cards.a}
          </div>
          <div className={styles.cardB} data-intro="0.8">
            {cards.b}
          </div>
        </div>
      </Container>
    </section>
  );
}
