import { Container, Eyebrow, Heading, Photo } from "@/components/ui";
import type { Picture } from "./media";
import styles from "./LandingBand.module.css";

type LandingBandProps = {
  picture: Picture;
  eyebrow: string;
  title: string;
};

/** A full-width photograph with one line of text over it. A pause between two dense sections. */
export function LandingBand({ picture, eyebrow, title }: LandingBandProps) {
  return (
    <section className={styles.band} aria-label={picture.alt}>
      <div className={styles.photo}>
        <Photo
          src={picture.image}
          alt=""
          parallax
          rounded={false}
          sizes="100vw"
          objectPosition={picture.position}
        />
        <div className={styles.shade} />
      </div>
      <Container className={styles.copy}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading as="h2" size="xl" reveal className={styles.title}>
          {title}
        </Heading>
      </Container>
    </section>
  );
}
