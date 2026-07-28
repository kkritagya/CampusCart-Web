"use client";

import { Button } from "@/components/ui/button";
import { checkoutCartAction, removeFromCartAction } from "@/lib/actions/cart_actions";
import type { BillingAddress, Cart, PurchasedOrder } from "@/lib/api/cart_api";
import { formatMarketplacePrice } from "@/lib/marketplace/products";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import styles from "./cart.module.css";

export function CartExperience({ initialCart, initialPurchases, user }: { initialCart: Cart; initialPurchases: PurchasedOrder[]; user: { fullName: string; email: string; phone: string; address: string } }) {
  const [cart, setCart] = useState(initialCart);
  const [message, setMessage] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [billing, setBilling] = useState<BillingAddress>({ fullName: user.fullName, email: user.email, phone: user.phone, addressLine1: user.address, addressLine2: "", city: "", region: "", postalCode: "" });

  const update = (field: keyof BillingAddress, value: string) => setBilling((current) => ({ ...current, [field]: value }));
  const remove = async (id: string) => {
    const result = await removeFromCartAction(id);
    if (result.success) setCart(result.data);
    else setMessage(result.message);
  };
  const checkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckingOut(true);
    setMessage("");
    const result = await checkoutCartAction(billing);
    if (!result.success) {
      setMessage(result.message);
      setCheckingOut(false);
      return;
    }
    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.data.paymentUrl;
    Object.entries(result.data.fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  return <div className={styles.page}>
    <header className={styles.heading}><div><p>CampusCart checkout</p><h1>Your Cart</h1><span>{cart.items.length} {cart.items.length === 1 ? "item" : "items"} ready for checkout</span></div><Button href="/saved" variant="outline">View saved items</Button></header>
    {!cart.items.length ? <section className={styles.empty}><h2>Your cart is empty</h2><p>Add an available listing or move an item from Saved Items.</p><Button href="/marketplace">Browse marketplace</Button></section> :
    <div className={styles.layout}>
      <section className={styles.items} aria-label="Cart items">
        {cart.items.map((item) => <article key={item.id}>
          <div className={styles.image}>{item.images[0]?.src ? <Image src={item.images[0].src} alt={item.images[0].label} fill sizes="10rem" /> : <span>{item.category.slice(0, 1)}</span>}</div>
          <div className={styles.itemCopy}><span>{item.condition} · {item.campus}</span><h2>{item.title}</h2><p>Sold by {item.sellerName ?? "CampusCart student"}</p><button type="button" onClick={() => void remove(item.id)}>Remove</button></div>
          <strong>{formatMarketplacePrice(item.price)}</strong>
        </article>)}
      </section>
      <aside>
        <section className={styles.summary}><h2>Order summary</h2><dl><div><dt>Subtotal</dt><dd>{formatMarketplacePrice(cart.subtotal)}</dd></div><div><dt>Campus pickup</dt><dd>Free</dd></div><div><dt>Total</dt><dd>{formatMarketplacePrice(cart.total)}</dd></div></dl><p>Listings are reserved only after checkout is completed.</p></section>
        <form className={styles.billing} onSubmit={checkout}>
          <h2>Billing address</h2>
          <p>This information is stored with your order and used for purchase records.</p>
          <div className={styles.fields}>
            <label>Full name<input required value={billing.fullName} onChange={(e) => update("fullName", e.target.value)} /></label>
            <label>Email<input required type="email" value={billing.email} onChange={(e) => update("email", e.target.value)} /></label>
            <label>Phone<input required type="tel" value={billing.phone} onChange={(e) => update("phone", e.target.value)} /></label>
            <label className={styles.full}>Address line 1<input required value={billing.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} /></label>
            <label className={styles.full}>Address line 2 <small>Optional</small><input value={billing.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} /></label>
            <label>City<input required value={billing.city} onChange={(e) => update("city", e.target.value)} /></label>
            <label>Province / region<input required value={billing.region} onChange={(e) => update("region", e.target.value)} /></label>
            <label>Postal code<input required value={billing.postalCode} onChange={(e) => update("postalCode", e.target.value)} /></label>
          </div>
          <div className={styles.payment}><strong>Payment method</strong><span>eSewa</span><small>You will continue to eSewa to securely complete payment.</small></div>
          {message ? <p className={styles.error} role="alert">{message}</p> : null}
          <button className={styles.checkout} disabled={checkingOut}>{checkingOut ? "Connecting to eSewa..." : `Pay with eSewa · ${formatMarketplacePrice(cart.total)}`}</button>
        </form>
      </aside>
    </div>}
    <section className={styles.purchased} aria-labelledby="purchased-heading">
      <div className={styles.purchasedHeading}>
        <div><p>Order history</p><h2 id="purchased-heading">Purchased</h2></div>
        <span>{initialPurchases.length} {initialPurchases.length === 1 ? "order" : "orders"}</span>
      </div>
      {!initialPurchases.length ? <div className={styles.noPurchases}><p>Your completed purchases will appear here.</p></div> :
        <div className={styles.orderList}>{initialPurchases.map((order) =>
          <article className={styles.order} key={order.id}>
            <header><div><strong>Purchased</strong><span>{new Intl.DateTimeFormat("en-NP", { dateStyle: "medium" }).format(new Date(order.purchasedAt))}</span></div><b>{order.status}</b></header>
            <div className={styles.purchasedItems}>{order.items.map((item) =>
              <div key={item.listingId}>
                <div className={styles.purchasedImage}>{item.image ? <Image src={`/api/uploads/${item.image.replace(/^\/?uploads\//, "")}`} alt={item.title} fill sizes="4rem" /> : <span>{item.title.slice(0, 1)}</span>}</div>
                <span>{item.title}</span><strong>{formatMarketplacePrice(item.price)}</strong>
              </div>)}</div>
            <footer><span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span><strong>Total {formatMarketplacePrice(order.total)}</strong></footer>
          </article>)}</div>}
    </section>
  </div>;
}
