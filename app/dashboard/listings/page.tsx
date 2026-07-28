import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../../account-pages.module.css";
import { ListingsManager } from "./listings-manager";
import { fetchMyListings } from "@/lib/api/listing_api";

export default async function ListingsPage() {
  await requireCurrentUser();
  const listings = await fetchMyListings();
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><PageContainer><header className={styles.header}><p className={styles.eyebrow}>Your shop</p><h1>My listings</h1><p>Edit, review, or remove the items you have posted.</p></header>{listings.success ? <ListingsManager initialListings={listings.data} /> : <div className={styles.panel}><h2>Listings unavailable</h2><p>{listings.message}</p></div>}</PageContainer></main><SiteFooter /></div>;
}
