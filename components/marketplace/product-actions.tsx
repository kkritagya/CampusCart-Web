"use client";

import { Button } from "@/components/ui/button";
import {
  openConversationAction,
  saveListingAction,
  unsaveListingAction,
} from "@/lib/actions/social_actions";
import { addToCartAction } from "@/lib/actions/cart_actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./product-details.module.css";

type ProductActionsProps = {
  productId: string;
  initiallySaved?: boolean;
};

export function ProductActions({ productId, initiallySaved = false }: ProductActionsProps) {
  const router = useRouter();
  const [saved,setSaved]=useState(initiallySaved);
  const [message,setMessage]=useState("");
  const toggle=async()=>{
    const result=saved?await unsaveListingAction(productId):await saveListingAction(productId);
    if(result.success){setSaved(!saved);setMessage(saved?"Removed from saved items.":"Saved to your account.");}
    else setMessage(result.message ?? "Unable to add this item to your cart.");
  };
  const contact=async()=>{
    const result=await openConversationAction(productId);
    if(result.success)router.push(`/messages/${result.data.id}`);
    else setMessage(result.message);
  };
  const addToCart=async(buyNow=false)=>{
    const result=await addToCartAction(productId);
    if(result.success){setMessage("Added to your cart.");if(buyNow)router.push("/cart");}
    else setMessage(result.message);
  };

  return (
    <section className={styles.actions} aria-label="Listing actions">
      <Button
        type="button"
        size="large"
        className={styles.contactButton}
        onClick={()=>void contact()}
      >
        Contact seller
      </Button>
      <Button type="button" size="large" className={styles.contactButton} onClick={()=>void addToCart(true)}>
        Buy now
      </Button>
      <Button type="button" variant="outline" size="large" className={styles.saveButton} onClick={()=>void addToCart()}>
        Add to cart
      </Button>
      <Button
        type="button"
        variant="outline"
        size="large"
        className={styles.saveButton}
        aria-pressed={saved}
        onClick={()=>void toggle()}
      >
        <span className={styles.actionIcon} aria-hidden="true">
          {saved ? "♥" : "♡"}
        </span>
        {saved ? "Saved" : "Save item"}
      </Button>
      {message?<p className={styles.actionMessage} role="status">{message}</p>:null}
    </section>
  );
}
