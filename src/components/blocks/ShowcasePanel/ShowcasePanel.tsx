import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Heading, Text } from "@/components/ui";
import { cx } from "@/lib/cx";
import { Scene } from "../Scene";
import styles from "./ShowcasePanel.module.css";

type ShowcasePanelProps = {
  title: string;
  text: string;
  sceneLabel: string;
  background?: "rings" | { image: StaticImageData; position?: string };
  /** Width in a 12-column grid. */
  span?: 5 | 6 | 7 | 12;
  align?: "center" | "top" | "bottom";
  children: ReactNode;
};

/** A showcase tile: an illustrated scene with a caption along the bottom. */
export function ShowcasePanel({
  title,
  text,
  sceneLabel,
  background = "rings",
  span = 6,
  align = "top",
  children,
}: ShowcasePanelProps) {
  return (
    <article className={cx(styles.panel, styles[`span-${span}`])}>
      <Scene label={sceneLabel} background={background} align={align} className={styles.scene}>
        {children}
      </Scene>
      <div className={styles.caption}>
        <Heading as="h3" size="lg" family="body">
          {title}
        </Heading>
        <Text size="xs" tone="muted" measure="narrow">
          {text}
        </Text>
      </div>
    </article>
  );
}

/** 12-column grid for ShowcasePanels. */
export function ShowcaseGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
