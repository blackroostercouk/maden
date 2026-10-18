import { CheckList, Heading, Text, type CheckItem } from "@/components/ui";
import { cx } from "@/lib/cx";
import styles from "./PlanCard.module.css";

export type Plan = {
  id: string;
  audience: string;
  title: string;
  featured?: boolean;
  items: readonly CheckItem[];
};

/** A plan summary. The featured card gets the deep green surface. */
export function PlanCard({ plan }: { plan: Plan }) {
  const titleId = `plan-${plan.id}`;
  return (
    <article
      className={cx(styles.card, plan.featured ? styles.featured : styles.outlined)}
      aria-labelledby={titleId}
    >
      <Text size="xs" tone="accent">
        {plan.audience}
      </Text>
      <Heading as="h3" id={titleId} size="2xl" italic={plan.featured}>
        {plan.title}
      </Heading>
      <CheckList items={[...plan.items]} detailTone={plan.featured ? "soft" : "muted"} />
    </article>
  );
}

/** Two-up layout for plan cards, wider first column. */
export function PlanGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.grid} data-reveal="stagger">
      {children}
    </div>
  );
}
