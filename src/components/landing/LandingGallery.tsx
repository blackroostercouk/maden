import { Eyebrow, Heading, Photo, Text } from "@/components/ui";
import type { Picture } from "./media";
import styles from "./LandingGallery.module.css";

type LandingGalleryProps = {
  pictures: readonly Picture[];
  captions: readonly string[];
  eyebrow: string;
  title: string;
  intro: string;
};

/** Three photographs with captions, the middle one set lower, for pages about making something personal. */
export function LandingGallery({ pictures, captions, eyebrow, title, intro }: LandingGalleryProps) {
  return (
    <>
      <header className={styles.header}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading id="gallery-title" reveal>
          {title}
        </Heading>
        <Text tone="muted" measure="narrow">
          {intro}
        </Text>
      </header>
      <ul className={styles.grid} data-reveal="stagger">
        {pictures.map((picture, index) => (
          <li key={picture.alt} className={styles.item}>
            <figure className={styles.figure}>
              <Photo
                src={picture.image}
                alt={picture.alt}
                aspect="4 / 5"
                sizes="(max-width: 900px) 100vw, 33vw"
                objectPosition={picture.position}
              />
              <figcaption className={styles.caption}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                {captions[index]}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
