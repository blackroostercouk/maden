import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Container.module.css";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Centres content at the page width with the standard side gutters. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cx(styles.container, className)}>{children}</Tag>;
}
