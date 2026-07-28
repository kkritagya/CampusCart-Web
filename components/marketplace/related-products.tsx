import { ProductCard } from "@/components/marketplace/product-card";
import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import Link from "next/link";
import styles from "./product-details.module.css";

type RelatedProductsProps = {
  products: MarketplaceProduct[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className={styles.relatedSection} aria-labelledby="related-heading">
      <div className={styles.relatedHeader}>
        <h2 id="related-heading">Related listings</h2>
        <Link href="/marketplace">Browse the marketplace</Link>
      </div>
      <div className={styles.relatedGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            href={`/marketplace/${product.id}`}
            title={product.title}
            price={formatMarketplacePrice(product.price)}
            condition={product.condition}
            location={product.campus}
            timestamp={product.postedLabel}
            verified={product.verified}
            image={product.images[0]?.src}
            imageAlt={product.images[0]?.label}
            visualTone={product.visualTone}
            showViewDetails
          />
        ))}
      </div>
    </section>
  );
}
