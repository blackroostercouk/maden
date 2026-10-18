import cup from "@/assets/images/cup.webp";
import serum from "@/assets/images/serum.webp";
import shopkeeper from "@/assets/images/shopkeeper.webp";
import trainer from "@/assets/images/trainer.webp";
import warehouse from "@/assets/images/warehouse.webp";
import { ServiceList, ShowcaseGrid, ShowcasePanel } from "@/components/blocks";
import {
  MockButton,
  MockCard,
  MockHeader,
  MockLineItem,
  MockOption,
  MockRow,
  MockTable,
  Phone,
  PhoneField,
  Pill,
  Swatches,
} from "@/components/mock";
import { Section, SectionHeader } from "@/components/ui";
import { build } from "@/content/site";
import styles from "./Build.module.css";

const glazes = [
  "var(--palette-swatch-sage)",
  "var(--palette-swatch-oat)",
  "var(--palette-swatch-navy)",
  "var(--palette-swatch-clay)",
];

export function Build() {
  const { showcase } = build;
  return (
    <Section id="build" labelledBy="build-title" spacing="flush-top">
      <SectionHeader
        eyebrow={build.eyebrow}
        title={build.title}
        titleId="build-title"
        intro={build.intro}
      />

      <ShowcaseGrid>
        <ShowcasePanel span={7} {...showcase.checkout}>
          <MockCard width="lg" float>
            <MockHeader dot>Checkout, information step</MockHeader>
            <MockLineItem image={trainer} title="Moss suede trainer" meta="UK 9" value="£145.00" />
            <MockOption label="Trade account discount (18%)" trailing={<b>−£26.10</b>} selected />
            <MockOption label="Nominated day delivery" trailing={<b>Thu 22 Oct</b>} />
            <MockRow label="Total" value="£118.90" total />
            <MockButton>Continue to shipping</MockButton>
          </MockCard>
        </ShowcasePanel>

        <ShowcasePanel span={5} background={{ image: warehouse }} {...showcase.admin}>
          <MockCard width="lg" float>
            <MockHeader variant="app" trailing={<Pill>Live</Pill>}>
              Fulfilment sync
            </MockHeader>
            <MockTable
              rows={[
                { label: "Order #4821 sent to 3PL", status: "Done" },
                { label: "312 SKUs restocked from ERP", status: "Done" },
                { label: "Tracking numbers written back", status: "Done" },
                { label: "Next run", status: "in 4 min" },
              ]}
            />
          </MockCard>
        </ShowcasePanel>

        <ShowcasePanel
          span={5}
          background={{ image: shopkeeper, position: "50% 20%" }}
          align="bottom"
          {...showcase.b2b}
        >
          <MockCard width="md" float className={styles.offset}>
            <MockHeader trailing={<Pill>Net 30</Pill>}>Price list: UK trade</MockHeader>
            <MockLineItem
              image={serum}
              title="Rosemary face oil, 30ml"
              meta="Minimum order 12"
              value={
                <>
                  <s className={styles.strike}>£34.00</s> £18.70
                </>
              }
            />
            <MockRow label="12 units" value={<b>£224.40</b>} />
          </MockCard>
        </ShowcasePanel>

        <ShowcasePanel span={7} {...showcase.storefront}>
          <Phone image={cup} cta="Add to bag, £32.00">
            <h4>Speckled stoneware mug</h4>
            <span className={styles.price}>£28.00</span>
            <span>Glaze: Sage</span>
            <Swatches colors={glazes} />
            <PhoneField label="Initials on the base, +£4" value="K.Y." />
          </Phone>
        </ShowcasePanel>
      </ShowcaseGrid>

      <ServiceList items={build.services} />
    </Section>
  );
}
