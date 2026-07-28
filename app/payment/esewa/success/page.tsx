import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { verifyEsewaPaymentAction } from "@/lib/actions/cart_actions";
import { redirect } from "next/navigation";
import styles from "../payment-result.module.css";

export default async function EsewaSuccessPage({ searchParams }: { searchParams: Promise<{ data?: string | string[] }> }) {
  const rawData = (await searchParams).data;
  const data = Array.isArray(rawData) ? rawData[0] : rawData;
  const result = data ? await verifyEsewaPaymentAction(data) : { success: false as const, message: "eSewa did not return payment details." };

  if (result.success) redirect("/?orderPlaced=1");

  return <div className={styles.page}><SiteHeader /><main className={styles.main}><section className={styles.card}>
    <span className={`${styles.icon} ${styles.errorIcon}`}>!</span>
    <h1>Payment could not be verified</h1>
    <p>{result.message}</p>
    <div className={styles.actions}><Button href="/cart">Return to cart</Button></div>
  </section></main><SiteFooter /></div>;
}
