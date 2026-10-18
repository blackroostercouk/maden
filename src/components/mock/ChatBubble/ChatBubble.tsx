import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./ChatBubble.module.css";

type ChatBubbleProps = {
  from: "customer" | "agent";
  children: ReactNode;
};

export function ChatBubble({ from, children }: ChatBubbleProps) {
  return <p className={cx(styles.bubble, styles[from])}>{children}</p>;
}
