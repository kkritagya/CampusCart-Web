"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteListingAction } from "@/lib/actions/listing_actions";
import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import type { SellerEarnings } from "@/lib/api/cart_api";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./listings-manager.module.css";

export function ListingsManager({ initialListings, earnings, dashboard = false }: { initialListings: MarketplaceProduct[]; earnings?: SellerEarnings; dashboard?: boolean }) {
  const [listings, setListings] = useState(initialListings);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const created = useSearchParams().get("created") === "1";
  const visible = filter === "All" ? listings : listings.filter((item) => (item.status ?? "Active") === filter);

  const remove = async (id: string) => {
    const result = await deleteListingAction(id);
    if (result.success) {
      setListings((items) => items.filter((item) => item.id !== id));
      setMessage("Listing deleted.");
    } else setMessage(result.message);
    setPendingDelete(null);
  };

  const content = <section className={styles.content}>
    <header className={styles.heading}>
      <h1>My Listings</h1>
      <Button href="/sell">+ Create New Listing</Button>
    </header>
    <div className={styles.filters}>
      {["All", "Active", "Sold", "Pending"].map((item) => <button type="button" className={filter === item ? styles.selected : ""} onClick={() => setFilter(item)} key={item}>{item} ({item === "All" ? listings.length : listings.filter((listing) => (listing.status ?? "Active") === item).length})</button>)}
    </div>
    {created ? <p className={styles.success}>Your listing was submitted and will appear in the marketplace after admin approval.</p> : null}
    {message ? <p role="status">{message}</p> : null}
    <div className={styles.list}>
      {visible.map((item) => <article className={styles.item} key={item.id}>
        <div className={styles.media}>
          {item.images[0]?.src ? <Image src={item.images[0].src} alt={item.images[0].label ?? item.title} fill sizes="70vw" /> : <div className={styles.placeholder} />}
          <Badge variant={item.verificationStatus === "Verified" && item.status === "Active" ? "success" : "neutral"} className={styles.status}>
            {item.verificationStatus === "Pending" ? "Pending review" : item.verificationStatus === "Rejected" ? "Rejected" : item.status ?? "Active"}
          </Badge>
          <strong className={styles.price}>{formatMarketplacePrice(item.price)}</strong>
        </div>
        <div className={styles.itemBody}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className={styles.itemFooter}><span>◉ {item.views ?? 0} Views</span><div><Button href={`/dashboard/listings/${item.id}/edit`} variant="ghost">✎</Button><button type="button" className={styles.delete} onClick={() => setPendingDelete(item.id)}>♲</button></div></div>
          {pendingDelete === item.id ? <div className={styles.confirm}><span>Delete “{item.title}”?</span><Button type="button" variant="ghost" onClick={() => setPendingDelete(null)}>Cancel</Button><button type="button" className={styles.deleteText} onClick={() => void remove(item.id)}>Delete</button></div> : null}
        </div>
      </article>)}
    </div>
  </section>;

  if (!dashboard) return content;
  return <div className={styles.dashboard}>
    <aside className={styles.sidebar}>
      <section className={styles.earnings}>
        <strong>Total earnings</strong>
        <div>
          <b>{formatMarketplacePrice(earnings?.totalEarnings ?? 0)}</b>
          <span>From completed payments</span>
        </div>
        <div className={styles.metrics}>
          <span><b>{earnings?.soldItems ?? 0}</b>Items sold</span>
          <span><b>{earnings?.paidOrders ?? 0}</b>Paid orders</span>
        </div>
      </section>
      <nav><a className={styles.activeNav} href="/dashboard">▤ My Listings</a><a href="/saved">♡ Saved Items</a><a href="/user/update">⚙ Profile Settings</a></nav>
    </aside>
    {content}
  </div>;
}
