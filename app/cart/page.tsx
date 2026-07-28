import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import { fetchCart, fetchPurchasedOrders } from "@/lib/api/cart_api";
import styles from "../account-pages.module.css";
import { CartExperience } from "./cart-experience";

export default async function CartPage() {
  const user = await requireCurrentUser();
  const [cart, purchases] = await Promise.all([fetchCart(), fetchPurchasedOrders()]);
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><PageContainer>{cart.success ? <CartExperience initialCart={cart.data} initialPurchases={purchases.success ? purchases.data : []} user={{ fullName: user.fullName ?? user.name ?? "", email: user.email, phone: user.phone ?? "", address: user.address ?? "" }} /> : <div className={styles.panel}><h1>Cart unavailable</h1><p>{cart.message}</p></div>}</PageContainer></main><SiteFooter /></div>;
}
