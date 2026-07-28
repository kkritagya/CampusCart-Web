import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../../../../account-pages.module.css";
import { EditListingContent } from "./edit-listing-content";
import { fetchMyListings } from "@/lib/api/listing_api";

export default async function EditListingPage({params}:{params:Promise<{id:string}>}) {
  await requireCurrentUser();
  const { id } = await params;
  const listings = await fetchMyListings();
  const listing = listings.success
    ? listings.data.find((item) => item.id === id)
    : undefined;
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><PageContainer><header className={styles.header}><p className={styles.eyebrow}>Manage listing</p><h1>Edit listing</h1><p>Update your item details.</p></header><EditListingContent id={id} listing={listing} loadError={listings.success?undefined:listings.message} /></PageContainer></main><SiteFooter /></div>;
}
