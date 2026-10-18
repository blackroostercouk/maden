import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Phone.module.css";

type PhoneProps = {
  image: StaticImageData;
  cta: string;
  className?: string;
  children: ReactNode;
};

/** A phone frame showing a product page: image on top, details, and a buy button. */
export function Phone({ image, cta, className, children }: PhoneProps) {
  return (
    <div aria-hidden="true" className={cx(styles.phone, className)} data-float>
      <div className={styles.screen}>
        <div className={styles.media}>
          <Image src={image} alt="" fill sizes="240px" className={styles.image} />
        </div>
        <div className={styles.body}>{children}</div>
        <span className={styles.cta}>{cta}</span>
      </div>
    </div>
  );
}

/** Colour choice dots for a product page. The first is selected. */
export function Swatches({ colors, selected = 0 }: { colors: string[]; selected?: number }) {
  return (
    <div className={styles.swatches}>
      {colors.map((color, index) => (
        <i
          key={color}
          className={cx(styles.swatch, index === selected && styles.swatchOn)}
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

/** A filled-in text field graphic. */
export function PhoneField({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
