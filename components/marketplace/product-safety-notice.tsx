import styles from "./product-details.module.css";

export function ProductSafetyNotice() {
  return (
    <aside className={styles.safetyNotice} aria-labelledby="safety-heading">
      <span className={styles.safetyMark} aria-hidden="true">!</span>
      <div>
        <h2 id="safety-heading">Trade safely on campus</h2>
        <p>
          Meet in a public place, inspect the item before paying, avoid advance
          payments, and step away from listings that feel suspicious.
        </p>
      </div>
    </aside>
  );
}
