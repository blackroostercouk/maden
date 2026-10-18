import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Backdrop, Photo } from "@/components/ui";
import { cx } from "@/lib/cx";
import styles from "./Scene.module.css";

type SceneProps = {
  /** Describes the whole illustration for screen readers. */
  label: string;
  /** Background: green rings, or a photograph. */
  background?: "rings" | { image: StaticImageData; position?: string };
  /** Vertical placement of the cards inside the scene. */
  align?: "center" | "top" | "bottom";
  className?: string;
  children: ReactNode;
};

/**
 * A panel that holds interface cards over a backdrop. Cards inside with
 * `float` rise into place when the scene scrolls into view.
 */
export function Scene({
  label,
  background = "rings",
  align = "center",
  className,
  children,
}: SceneProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx(styles.scene, styles[`align-${align}`], className)}
      data-float-scope
    >
      {background === "rings" ? (
        <Backdrop pattern="rings" />
      ) : (
        <div className={styles.photo} aria-hidden="true">
          <Photo
            src={background.image}
            alt=""
            parallax
            rounded={false}
            sizes="(max-width: 900px) 100vw, 50vw"
            objectPosition={background.position}
          />
          <span className={styles.shade} />
        </div>
      )}
      {children}
    </div>
  );
}
