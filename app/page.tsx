import { PageContainer } from "@/components/layout/page-container";
import { HomeCatalog } from "@/components/home/home-catalog";
import { OrderSuccessNotice } from "@/components/order-success-notice";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./page.css";

export default async function Home({ searchParams }: { searchParams: Promise<{ orderPlaced?: string | string[] }> }) {
  const orderPlaced = (await searchParams).orderPlaced === "1";

  return (
    <div className="landing-page">
      <SiteHeader />
      {orderPlaced ? <OrderSuccessNotice /> : null}
      <main>
        <section className="hero-section" aria-labelledby="hero-heading">
          <PageContainer className="hero-layout">
            <div className="hero-copy">
              <h1 id="hero-heading">Smart Buying &amp; Selling for Students</h1>
              <p>
                Your university&apos;s verified peer-to-peer marketplace. Trade
                electronics, textbooks, and furniture with students you trust.
              </p>
              <form className="hero-search" action="/marketplace">
                <span aria-hidden="true">⌕</span>
                <input
                  name="search"
                  aria-label="Search marketplace"
                  placeholder="Search for textbooks, laptops, or chairs..."
                />
                <button type="submit">Search</button>
              </form>
              <div className="hero-quick" aria-label="Quick filters">
                <span>Quick filters</span>
                <Link href="/marketplace">All items</Link>
                <Link href="/marketplace">Nearby</Link>
                <Link href="/marketplace">Under $50</Link>
                <Link href="/marketplace">Free</Link>
              </div>
              <div className="hero-actions">
                <Button href="/sell" size="large">⊕ Sell Now</Button>
              </div>
            </div>
          </PageContainer>
        </section>

        <HomeCatalog />

        <section className="trust-section">
          <PageContainer className="trust-layout">
            <div>
              <h2>Trade with Confidence</h2>
              <p>
                Every user is verified through their university email. Safe
                meeting spots provided by campus security are recommended for
                every transaction.
              </p>
              <div className="trust-badges">
                <strong>Verified users</strong>
                <strong>On-campus pickup</strong>
              </div>
            </div>
            <blockquote>
              “CampusCart made selling my old textbooks so much easier than the
              bookstore. Better prices and safer than other sites!”
              <span>Alex Johnson · Verified Student</span>
            </blockquote>
          </PageContainer>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
