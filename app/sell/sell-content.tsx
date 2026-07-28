"use client";

import { ListingForm } from "@/components/listings/listing-form";
import { createListingAction } from "@/lib/actions/listing_actions";
import type { ValidListingValues } from "@/lib/validation/listing";
import { useRouter } from "next/navigation";
import { buildListingFormData } from "@/lib/marketplace/listing-form-data";

export function SellContent() {
  const router = useRouter();
  const submit = async (values: ValidListingValues, images: File[]) => {
    const result = await createListingAction(buildListingFormData(values,images));
    if (result.success) router.push("/dashboard/listings?created=1");
  };
  return <ListingForm submitLabel="Submit for review" onSubmit={submit} />;
}
