import type { ReactNode } from "react";
import styles from "./section-heading.module.css";

type SectionHeadingProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  action,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`${styles.heading} ${align === "center" ? styles.centered : ""}`}
    >
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
