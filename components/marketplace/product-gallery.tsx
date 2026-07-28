"use client";

import type { MarketplaceProductImage } from "@/lib/data/marketplace";
import { useState } from "react";
import Image from "next/image";
import styles from "./product-details.module.css";

type ProductGalleryProps = {
  title: string;
  images: MarketplaceProductImage[];
};

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) return null;

  return (
    <section className={styles.gallery} aria-label={`${title} image gallery`}>
      <div
        className={styles.primaryImage}
        role="img"
        aria-label={activeImage.label}
      >
        {activeImage.src?<Image src={activeImage.src} alt={activeImage.label} fill sizes="(max-width: 768px) 100vw, 50vw" style={{objectFit:"contain"}}/>:<div className={styles.imageTreatment} data-tone={activeImage.tone} data-variant={activeImage.variant} aria-hidden="true"/>}
        <span className={styles.galleryLabel}>{activeImage.label}</span>
      </div>
      {images.length > 1 ? (
        <div className={styles.thumbnails} aria-label="Choose product image">
          {images.map((image, index) => (
            <button
              key={`${image.label}-${index}`}
              type="button"
              className={styles.thumbnail}
              aria-label={`Show ${image.label}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              {image.src?<Image src={image.src} alt="" fill sizes="80px" style={{objectFit:"contain"}}/>:<span className={styles.thumbnailTreatment} data-tone={image.tone} data-variant={image.variant} aria-hidden="true"/>}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
