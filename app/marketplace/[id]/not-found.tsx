import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import styles from "./product-detail.module.css";

export default function ProductNotFound() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <PageContainer className={styles.notFound}>
          <section className={styles.notFoundCard}>
            <p className={styles.notFoundCode}>Listing unavailable</p>
            <h1>We couldn&apos;t find that item.</h1>
            <p>
              The listing may have been removed, sold, or the link may be
              incorrect.
            </p>
            <Button href="/marketplace">Back to marketplace</Button>
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}
