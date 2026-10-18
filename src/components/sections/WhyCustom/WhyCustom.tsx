import { BigFigure, CompareTable } from "@/components/blocks";
import { MockCaption, MockCard, MockHeader, Pill, WeightChart } from "@/components/mock";
import { Eyebrow, Section, SectionHeader, Split, Stack, Text } from "@/components/ui";
import { whyCustom } from "@/content/site";
import styles from "./WhyCustom.module.css";

export function WhyCustom() {
  const { cost, weight } = whyCustom;
  return (
    <Section id="fit" labelledBy="fit-title">
      <SectionHeader
        eyebrow={whyCustom.eyebrow}
        title={whyCustom.title}
        titleId="fit-title"
        intro={whyCustom.intro}
      />
      <CompareTable
        label="App Store apps compared with a Moden app"
        columns={whyCustom.columns}
        rows={whyCustom.rows}
      />

      <Split ratio="1:1" className={styles.costs}>
        <BigFigure
          eyebrow={cost.eyebrow}
          labelId="cost-seen"
          value={cost.hoursPerDay * cost.hourlyRate * cost.workingDays}
          prefix="£"
          text={cost.text}
          note={cost.note}
        />
        <Stack as="aside" gap="6" aria-labelledby="cost-hidden">
          <Eyebrow id="cost-hidden">{weight.eyebrow}</Eyebrow>
          <Text size="lg" weight="book" measure="narrow">
            {weight.text}
          </Text>
          <div role="img" aria-label={weight.sceneLabel} className={styles.chart}>
            <MockCard width="full">
              <MockHeader trailing={<Pill tone="warning">{weight.chartPill}</Pill>}>
                {weight.chartTitle}
              </MockHeader>
              <WeightChart
                items={[...weight.items]}
                totalLabel={weight.totalLabel}
                ours={weight.ours}
              />
              <MockCaption>{weight.note}</MockCaption>
            </MockCard>
          </div>
        </Stack>
      </Split>
    </Section>
  );
}
