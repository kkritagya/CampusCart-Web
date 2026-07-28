import Link from "next/link";
import { PageContainer } from "./page-container";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <PageContainer>
        <div className={styles.content}>
          <div className={styles.intro}>
            <Link href="/" className={styles.brand} aria-label="CampusCart home">
              <span className={styles.brandName}>CampusCart</span>
            </Link>
            <p className={styles.description}>
              Helping students safely buy, sell, and exchange second-hand items
              within their campus community.
            </p>
          </div>

          <nav className={styles.group} aria-labelledby="footer-marketplace">
            <h2 id="footer-marketplace">Marketplace</h2>
            <ul className={styles.links}>
              <li><Link href="/marketplace">Browse items</Link></li>
              <li><Link href="/sell">Sell an item</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
            </ul>
          </nav>

          <nav className={styles.group} aria-labelledby="footer-account">
            <h2 id="footer-account">Account</h2>
            <ul className={styles.links}>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Create account</Link></li>
              <li><Link href="/user/update">Profile settings</Link></li>
            </ul>
          </nav>

          <nav className={styles.group} aria-labelledby="footer-support">
            <h2 id="footer-support">Support</h2>
            <ul className={styles.links}>
              <li><Link href="/help">Help center</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/terms">Terms of service</Link></li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 CampusCart. Built for campus communities.</p>
          <p className={styles.safety}>Meet in public campus spaces and verify items before paying.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
