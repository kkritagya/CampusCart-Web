"use client";

import { useEffect, useState } from "react";
import styles from "./order-success-notice.module.css";

export function OrderSuccessNotice() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("orderPlaced");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    const timeout = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.notice} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">✓</span>
      <span>Your order has been placed successfully.</span>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss notification">×</button>
    </div>
  );
}
