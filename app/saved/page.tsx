import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../account-pages.module.css";
import { SavedItems } from "./saved-items";
import { fetchSavedListings } from "@/lib/api/social_api";

export default async function SavedPage() {
  await requireCurrentUser();
  const saved=await fetchSavedListings();
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><PageContainer><header className={styles.header}><p className={styles.eyebrow}>Your shortlist</p><h1>Saved items</h1><p>Keep track of listings you may want to revisit.</p></header>{saved.success?<SavedItems initialItems={saved.data}/>:<div className={styles.panel}><h2>Saved items unavailable</h2><p>{saved.message}</p></div>}</PageContainer></main><SiteFooter /></div>;
}
