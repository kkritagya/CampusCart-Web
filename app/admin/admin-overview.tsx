"use client";

import { useMemo, useState, useTransition } from "react";
import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { approveAdminListing, deleteAdminListing, rejectAdminListing } from "@/lib/actions/admin_listing_actions";
import styles from "./admin-overview.module.css";
import moderation from "./moderation.module.css";

export function AdminOverview({
  initialListings,
  initialError = "",
}: {
  initialListings: MarketplaceProduct[];
  initialError?: string;
}) {
  const [listings, setListings] = useState(initialListings);
  const [filter, setFilter] = useState<"Pending" | "All" | "Verified" | "Rejected">("Pending");
  const [message, setMessage] = useState(initialError);
  const [pending, startTransition] = useTransition();
  const shown = useMemo(() => filter === "All" ? listings : listings.filter((item) => item.verificationStatus === filter), [filter, listings]);

  const update = (id: string, action: "approve" | "reject" | "delete") => {
    let reason = "";
    if (action === "reject") {
      reason = window.prompt("Why is this listing being rejected?")?.trim() ?? "";
      if (!reason) return;
    }
    if (action === "delete" && !window.confirm("Permanently delete this listing? This cannot be undone.")) return;
    setMessage("");
    startTransition(async () => {
      const result = action === "approve" ? await approveAdminListing(id) : action === "reject" ? await rejectAdminListing(id, reason) : await deleteAdminListing(id);
      if (!result.success) return setMessage(result.message);
      if (action === "delete") {
        setListings((items) => items.filter((item) => item.id !== id));
      } else if (result.data) {
        const updated = result.data;
        setListings((items) => items.map((item) => item.id === id ? updated : item));
      }
      setMessage(action === "approve" ? "Listing verified and approved." : action === "reject" ? "Listing rejected." : "Listing permanently deleted.");
    });
  };

  const pendingCount = listings.filter((item) => item.verificationStatus === "Pending").length;
  const verifiedCount = listings.filter((item) => item.verificationStatus === "Verified").length;
  const rejectedCount = listings.filter((item) => item.verificationStatus === "Rejected").length;

  return <div className={styles.page}>
    <section className={styles.stats}>
      <article><span className={styles.blue}>▣</span><div><small>Total Listings</small><strong>{listings.length}</strong><p>All submissions</p></div></article>
      <article><span className={styles.red}>!</span><div><small>Pending Review</small><strong>{pendingCount}</strong><p className={styles.danger}>Needs action</p></div></article>
      <article><span className={styles.mint}>✓</span><div><small>Verified</small><strong>{verifiedCount}</strong><p>{rejectedCount} rejected</p></div></article>
    </section>
    <section className={styles.approvals}>
      <header><div><h1>Listing Moderation</h1><small>Verify, reject, or remove submissions.</small></div><div className={moderation.filters}>
        {(["Pending", "All", "Verified", "Rejected"] as const).map((value) => <button className={filter === value ? moderation.activeFilter : ""} key={value} type="button" onClick={() => setFilter(value)}>{value}</button>)}
      </div></header>
      {message ? <p className={moderation.notice} role="alert">{message}</p> : null}
      <div className={styles.tableHead}><span>Product</span><span>Seller</span><span>Price</span><span>Actions</span></div>
      {shown.length ? shown.map((item) => <article key={item.id}>
        <div className={styles.product}><span>▣</span><div><strong>{item.title}</strong><small>{item.category} · {item.verificationStatus}</small></div></div>
        <span>{item.sellerName ?? "CampusCart seller"}</span><b>Rs. {item.price.toLocaleString()}</b>
        <div className={styles.rowActions}>
          <button disabled={pending || item.verificationStatus === "Verified"} type="button" aria-label={`Approve ${item.title}`} title="Approve" onClick={() => update(item.id, "approve")}>✓</button>
          <button disabled={pending || item.verificationStatus === "Rejected"} type="button" aria-label={`Reject ${item.title}`} title="Reject" onClick={() => update(item.id, "reject")}>×</button>
          <button disabled={pending} type="button" aria-label={`Delete ${item.title}`} title="Delete permanently" onClick={() => update(item.id, "delete")}>⌫</button>
        </div>
      </article>) : <p className={styles.done}>No {filter.toLowerCase()} listings.</p>}
    </section>
  </div>;
}
