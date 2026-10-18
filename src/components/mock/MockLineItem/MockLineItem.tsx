import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import styles from "./MockLineItem.module.css";

type MockLineItemProps = {
  image: StaticImageData;
  title: string;
  meta?: string;
  value?: ReactNode;
};

/** A product row: thumbnail, name, detail and price. */
export function MockLineItem({ image, title, meta, value }: MockLineItemProps) {
  return (
    <div className={styles.line}>
      <Image src={image} alt="" width={44} height={44} sizes="88px" className={styles.thumb} />
      <div className={styles.copy}>
        <b>{title}</b>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>
      {value !== undefined && <b className={styles.value}>{value}</b>}
    </div>
  );
}
