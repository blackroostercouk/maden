import type { CSSProperties } from "react";
import styles from "./MockStat.module.css";

type MockStatProps = {
  value: string;
  caption: string;
  /** Bar heights from 0 to 1; the last bar is highlighted. */
  bars?: number[];
};

/** A big number with a caption and an optional bar sparkline. */
export function MockStat({ value, caption, bars }: MockStatProps) {
  return (
    <>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.caption}>{caption}</p>
      </div>
      {bars && (
        <div className={styles.bars}>
          {bars.map((height, index) => (
            <i key={index} style={{ "--h": height } as CSSProperties} />
          ))}
        </div>
      )}
    </>
  );
}
