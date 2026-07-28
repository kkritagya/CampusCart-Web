import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import styles from "../payment-result.module.css";

export default function EsewaFailurePage() {
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><section className={styles.card}>
    <span className={`${styles.icon} ${styles.errorIcon}`}>!</span><h1>Payment not completed</h1>
    <p>Your order was not placed and your cart is still available. You can try eSewa again when ready.</p>
    <div className={styles.actions}><Button href="/cart">Return to cart</Button><Button href="/marketplace" variant="outline">Keep shopping</Button></div>
  </section></main><SiteFooter /></div>;
}
