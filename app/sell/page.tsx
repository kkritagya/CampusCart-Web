import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCurrentUser } from "@/lib/actions/authentication_action";
import styles from "../account-pages.module.css";
import { SellContent } from "./sell-content";

export default async function SellPage() {
  await requireCurrentUser();
  return <div className={styles.page}><SiteHeader /><main className={styles.main}><PageContainer><header className={styles.header}><h1>List your item</h1><p>Fill in the details below to reach thousands of students on campus.</p></header><SellContent /></PageContainer></main><SiteFooter /></div>;
}
