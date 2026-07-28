import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import { fetchMyListings } from "@/lib/api/listing_api";
import { fetchSellerEarnings } from "@/lib/api/cart_api";
import styles from "../account-pages.module.css";
import { ListingsManager } from "./listings/listings-manager";

export default async function DashboardPage() {
  await requireCurrentUser();
  const [listings, earnings] = await Promise.all([fetchMyListings(), fetchSellerEarnings()]);
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          {listings.success ? <ListingsManager initialListings={listings.data} earnings={earnings.success ? earnings.data : undefined} dashboard /> : <div className={styles.panel}><h2>Listings unavailable</h2><p>{listings.message}</p></div>}
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
