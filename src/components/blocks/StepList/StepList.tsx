import { Heading, Text } from "@/components/ui";
import styles from "./StepList.module.css";

export type Step = { name: string; duration: string; text: string };

/** Numbered steps joined by a thread that draws in as you scroll. */
export function StepList({ steps }: { steps: readonly Step[] }) {
  return (
    <div className={styles.wrap} data-thread-scope>
      <span className={styles.thread} aria-hidden="true">
        <i data-thread />
      </span>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.name} className={styles.step}>
            <div className={styles.top}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <Heading as="h3" size="2xl">
                {step.name}
              </Heading>
              <span className={styles.duration}>{step.duration}</span>
            </div>
            <Text tone="muted">{step.text}</Text>
          </li>
        ))}
      </ol>
    </div>
  );
}
