import styles from "./marketplace-preview-card.module.css";

export type MarketplacePreviewCardProps = {
  title: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  verified?: boolean;
  visualTone: "book" | "tech" | "home";
};

export function MarketplacePreviewCard({
  title,
  price,
  category,
  condition,
  location,
  visualTone,
}: MarketplacePreviewCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={visualTone} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.topline}>
          <span className={styles.category}>
            {category} · {condition}
          </span>
          <span className={styles.price}>{price}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span className={styles.location}>{location}</span>
        </div>
      </div>
    </article>
  );
}
