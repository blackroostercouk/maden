import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./Photo.module.css";

type PhotoProps = {
  src: StaticImageData;
  /** Empty string marks the image as decorative. */
  alt: string;
  /** CSS aspect-ratio for the frame, e.g. "21 / 9". Omit to fill the parent. */
  aspect?: string;
  /** Image drifts slower than the page while scrolling. */
  parallax?: boolean;
  priority?: boolean;
  sizes?: string;
  objectPosition?: CSSProperties["objectPosition"];
  /** Darken the lower part so text or cards on top stay readable. */
  scrim?: boolean;
  rounded?: boolean;
  className?: string;
};

/** Responsive photograph in a cropped frame. */
export function Photo({
  src,
  alt,
  aspect,
  parallax = false,
  priority = false,
  sizes = "100vw",
  objectPosition,
  scrim = false,
  rounded = true,
  className,
}: PhotoProps) {
  return (
    <div
      className={cx(
        styles.frame,
        rounded && styles.rounded,
        scrim && styles.scrim,
        !aspect && styles.fill,
        className,
      )}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={cx(styles.image, parallax && styles.parallax)}
        style={objectPosition ? { objectPosition } : undefined}
        data-parallax={parallax || undefined}
      />
    </div>
  );
}
