import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import styles from "./product-card.module.css";

export type ProductCardProps = {
  href: string;
  title: string;
  price: string;
  condition: string;
  location?: string;
  timestamp?: string;
  verified?: boolean;
  image?: string;
  imageAlt?: string;
  visualTone?: "book" | "tech" | "home" | "accessory";
  showViewDetails?: boolean;
};

export function ProductCard({
  href,
  title,
  price,
  condition,
  location,
  timestamp,
  image,
  imageAlt = "",
  visualTone = "tech",
  showViewDetails = false,
}: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media} data-tone={visualTone}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.topline}>
          <Badge variant="condition">{condition}</Badge>
          <p className={styles.price}>{price}</p>
        </div>
        <h3 className={styles.title}>
          <Link href={href} className={styles.link} aria-label={`View ${title}`}>
            {title}
          </Link>
        </h3>
        <p className={styles.meta}>
          {location ? <span>{location}</span> : <span>Campus pickup</span>}
          {timestamp ? <span>{timestamp}</span> : null}
        </p>
        {showViewDetails ? (
          <Button href={href} variant="outline" fullWidth className={styles.details}>
            View details
          </Button>
        ) : null}
      </div>
    </article>
  );
}
