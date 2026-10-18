import cup from "@/assets/images/cup.webp";
import studio from "@/assets/images/studio.webp";
import {
  MockCard,
  MockHeader,
  MockLineItem,
  MockOption,
  MockRow,
  MockStat,
  Pill,
  Toggle,
} from "@/components/mock";
import { WeaveCanvas } from "@/components/motion";
import { Backdrop, Button, Container, Heading, Photo, SpecList, Text } from "@/components/ui";
import { hero } from "@/content/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-pointer-scope>
      <Backdrop pattern="weave" />
      <WeaveCanvas />
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <Heading
            as="h1"
            id="hero-title"
            size="2xl"
            weight="semibold"
            lines={[...hero.titleLines]}
            intro
          />
          <div data-intro="0.55">
            <Text size="md" tone="soft" measure="narrow">
              {hero.lede}
            </Text>
          </div>
          <div className={styles.ctas}>
            <Button href={hero.primaryCta.href} withArrow>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </Button>
          </div>
          <div data-intro="0.7">
            <SpecList items={[...hero.specs]} />
          </div>
        </div>

        <div className={styles.stage} role="img" aria-label={hero.sceneLabel}>
          <div className={styles.photo} data-intro-clip>
            <Photo src={studio} alt="" priority scrim sizes="(max-width: 900px) 100vw, 55vw" />
          </div>

          <div className={styles.sync} data-intro="0.95">
            <MockCard width="full" depth={-1}>
              <MockHeader trailing={<Pill>Healthy</Pill>}>Stock sync</MockHeader>
              <MockStat
                value="1,284"
                caption="orders sent to your ERP today"
                bars={[0.35, 0.5, 0.42, 0.6, 0.55, 0.72, 0.64, 0.8, 0.7, 0.9, 0.84, 1]}
              />
            </MockCard>
          </div>

          <div className={styles.checkout} data-intro="0.8">
            <MockCard width="full" depth={1.4}>
              <MockHeader dot>Your checkout, with your rules</MockHeader>
              <MockLineItem image={cup} title="Speckled sage mug" meta="Qty 2" value="£56.00" />
              <MockOption
                label="Gift wrap with a handwritten note"
                trailing={<Toggle on />}
                selected
              />
              <MockRow label="Gift wrap" value="£3.50" />
              <MockRow label="Total" value="£59.50" total />
            </MockCard>
          </div>
        </div>
      </Container>
    </section>
  );
}
