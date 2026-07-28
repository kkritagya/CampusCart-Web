import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-container.module.css";

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
