import { PlanCard, PlanGrid } from "@/components/blocks";
import { Section, SectionHeader, Text } from "@/components/ui";
import { plans } from "@/content/site";
import styles from "./Plans.module.css";

export function Plans() {
  return (
    <Section id="plans" labelledBy="plans-title" spacing="flush-top">
      <SectionHeader
        eyebrow={plans.eyebrow}
        title={plans.title}
        titleId="plans-title"
        intro={plans.intro}
      />
      <PlanGrid>
        {plans.items.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </PlanGrid>
      <Text size="xs" tone="muted" className={styles.note}>
        {plans.note}
      </Text>
    </Section>
  );
}
