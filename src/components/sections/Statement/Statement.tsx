import studioDesk from "@/assets/images/studio-desk.webp";
import { Heading, Photo, Section, Split, Text } from "@/components/ui";
import { statement } from "@/content/site";
import styles from "./Statement.module.css";

export function Statement() {
  return (
    <Section spacing="flush-bottom" className={styles.section}>
      <Split ratio="7:4" align="end">
        <Heading as="p" size="xl" className={styles.lead}>
          {statement.lead} <em>{statement.emphasis}</em> {statement.tail}
        </Heading>
        <Text tone="muted">{statement.body}</Text>
      </Split>
      <figure className={styles.figure}>
        <Photo
          src={studioDesk}
          alt={statement.figure.alt}
          aspect="21 / 9"
          parallax
          sizes="100vw"
          className={styles.photo}
        />
        <figcaption className={styles.caption}>
          <span>{statement.figure.caption}</span>
          <span>{statement.figure.credit}</span>
        </figcaption>
      </figure>
    </Section>
  );
}
