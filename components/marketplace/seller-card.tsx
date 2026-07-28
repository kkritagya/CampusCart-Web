import type { MarketplaceSeller } from "@/lib/data/marketplace";
import styles from "./product-details.module.css";

type SellerCardProps = {
  seller: MarketplaceSeller;
  activeListingCount: number;
};

export function SellerCard({
  seller,
  activeListingCount,
}: SellerCardProps) {
  return (
    <section className={styles.sellerCard} aria-labelledby="seller-heading">
      <div className={styles.sellerHeading}>
        <div className={styles.avatar} aria-hidden="true">
          {seller.initials}
        </div>
        <div>
          <h2 id="seller-heading" className={styles.sellerName}>{seller.name}</h2>
        </div>
      </div>
      <dl className={styles.sellerMeta}>
        <div>
          <dt>Member since</dt>
          <dd>{seller.memberSince}</dd>
        </div>
        <div>
          <dt>Campus</dt>
          <dd>{seller.affiliation}</dd>
        </div>
        <div>
          <dt>Response</dt>
          <dd>{seller.responseTime}</dd>
        </div>
        <div>
          <dt>Active listings</dt>
          <dd>{activeListingCount}</dd>
        </div>
      </dl>
    </section>
  );
}
