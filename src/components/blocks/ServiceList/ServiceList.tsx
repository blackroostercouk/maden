import { Heading, Icon, Tag, Text } from "@/components/ui";
import { cx } from "@/lib/cx";
import styles from "./ServiceList.module.css";

export type Service = {
  title: string;
  text: string;
  plans: string;
  plusOnly?: boolean;
  /** Page with more about this kind of commission. Makes the whole row a link. */
  href?: string;
};

/** Ruled list of services: title, description and a plan tag on fixed columns. */
export function ServiceList({ items }: { items: readonly Service[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.title} className={styles.row} data-reveal="stagger">
          <Heading as="h3" size="xl" className={styles.title}>
            {item.href ? (
              <a href={item.href} className={cx(styles.link, styles.label)}>
                {item.title}
                <Icon name="arrowRight" size="sm" className={styles.arrow} />
              </a>
            ) : (
              <span className={styles.label}>{item.title}</span>
            )}
          </Heading>
          <Text tone="muted" className={styles.text}>
            {item.text}
          </Text>
          <Tag tone={item.plusOnly ? "accent" : "default"} className={styles.tag}>
            {item.plans}
          </Tag>
        </li>
      ))}
    </ul>
  );
}
