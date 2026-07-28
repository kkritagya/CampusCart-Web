"use client";

import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { useFrontendData } from "@/lib/context/FrontendDataContext";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import Link from "next/link";
import { useMemo } from "react";

export function HomeCatalog() {
  const { listings } = useFrontendData();
  const activeListings = useMemo(
    () =>
      listings
        .filter(
          (listing) =>
            (listing.status ?? "Active") === "Active" &&
            (listing.verificationStatus ?? "Verified") === "Verified"
        )
        .sort(
          (first, second) =>
            Date.parse(second.postedAt) - Date.parse(first.postedAt)
        ),
    [listings]
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    activeListings.forEach((listing) => {
      counts.set(listing.category, (counts.get(listing.category) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((first, second) => second[1] - first[1])
      .slice(0, 3);
  }, [activeListings]);

  return (
    <>
      <section id="categories" className="landing-section section-white">
        <div className="home-container">
          <SectionHeading
            title="Shop by Category"
            action={<Button href="/marketplace" variant="ghost">View All</Button>}
          />
          {categories.length ? (
            <div className="category-grid">
              {categories.map(([category, count]) => (
                <Link
                  href={`/marketplace?search=${encodeURIComponent(category)}`}
                  key={category}
                  className="category-card"
                >
                  <div>
                    <h3>{category}</h3>
                    <p>{count} {count === 1 ? "listing" : "listings"} available</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="home-empty">No categories are available yet.</p>
          )}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="featured-heading">
        <div className="home-container">
          <SectionHeading
            title="Featured Listings"
            action={<Button href="/marketplace" variant="ghost">View All</Button>}
          />
          {activeListings.length ? (
            <div className="product-grid" id="featured-heading">
              {activeListings.slice(0, 4).map((product) => (
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
                />
              ))}
            </div>
          ) : (
            <p className="home-empty">No active listings are available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
