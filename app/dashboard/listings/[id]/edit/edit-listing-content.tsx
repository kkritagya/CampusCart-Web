"use client";

import { ListingForm } from "@/components/listings/listing-form";
import { Button } from "@/components/ui/button";
import type { MarketplaceProduct } from "@/lib/data/marketplace";
import { updateListingAction } from "@/lib/actions/listing_actions";
import type { ValidListingValues } from "@/lib/validation/listing";
import { useRouter } from "next/navigation";
import styles from "../../../../account-pages.module.css";
import { buildListingFormData } from "@/lib/marketplace/listing-form-data";

export function EditListingContent({ id,listing,loadError }: { id: string;listing?:MarketplaceProduct;loadError?:string }) {
  const router = useRouter();
  if (!listing) return <div className={`${styles.panel} ${styles.empty}`}><h2>{loadError?"Listings unavailable":"Listing not found"}</h2><p>{loadError??"This listing does not exist or belongs to another seller."}</p><Button href="/dashboard/listings">Back to my listings</Button></div>;
  const submit = async (values: ValidListingValues, images: File[]) => {
    const result=await updateListingAction(id,buildListingFormData(values,images));
    if(result.success) router.push("/dashboard/listings");
  };
  return <ListingForm submitLabel="Save changes" initialValues={{...listing,tags:listing.tags?.join(", ") ?? ""}} onSubmit={submit} />;
}
