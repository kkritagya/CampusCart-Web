"use client";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/lib/actions/cart_actions";
import { unsaveListingAction } from "@/lib/actions/social_actions";
import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import { useState } from "react";
import pageStyles from "../account-pages.module.css";
import styles from "./saved-items.module.css";

export function SavedItems({ initialItems }: { initialItems: MarketplaceProduct[] }) {
  const [saved, setSaved] = useState(initialItems);
  const [message, setMessage] = useState("");
  const remove = async (id: string) => {
    const result = await unsaveListingAction(id);
    if (result.success) setSaved((items) => items.filter((item) => item.id !== id));
  };
  const add = async (id: string) => {
    const result = await addToCartAction(id);
    setMessage(result.message ?? (result.success ? "Added to cart." : "Unable to add this item."));
  };
  if (!saved.length) return <div className={styles.empty}><h2>No saved items</h2><p>Save a product to build your shortlist.</p><Button href="/marketplace">Browse marketplace</Button></div>;
  return <><p role="status">{message}</p><section className={pageStyles.grid} aria-label="Saved marketplace listings">{saved.map((item) => <div className={styles.item} key={item.id}><ProductCard href={`/marketplace/${item.id}`} title={item.title} price={formatMarketplacePrice(item.price)} condition={item.condition} location={item.campus} timestamp={item.postedLabel} verified={item.verified} image={item.images[0]?.src} imageAlt={item.images[0]?.label} visualTone={item.visualTone} showViewDetails /><Button type="button" fullWidth onClick={() => void add(item.id)}>Add to cart</Button><button type="button" className={styles.remove} onClick={() => void remove(item.id)}>Remove from saved</button></div>)}</section></>;
}
