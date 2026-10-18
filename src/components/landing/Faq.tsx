import { Icon } from "@/components/ui";
import type { LandingFaq } from "@/content/landings";
import styles from "./Faq.module.css";

/** Questions that open in place. Native details elements, so they work without JavaScript. */
export function Faq({ items }: { items: readonly LandingFaq[] }) {
  return (
    <div className={styles.list} data-reveal="stagger">
      {items.map((item) => (
        <details key={item.question} className={styles.item}>
          <summary className={styles.summary}>
            <span>{item.question}</span>
            <Icon name="arrowRight" size="sm" className={styles.icon} />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
