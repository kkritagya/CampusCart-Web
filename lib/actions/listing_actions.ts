"use server";

import {
  createApiListing,
  deleteApiListing,
  updateApiListing,
} from "@/lib/api/listing_api";
import { listingSchema } from "@/lib/validation/listing";
import { listingValuesFromFormData } from "@/lib/marketplace/listing-form-data";
import { revalidatePath } from "next/cache";

export async function createListingAction(formData: FormData) {
  const parsed = listingSchema.safeParse(listingValuesFromFormData(formData));
  if (!parsed.success) return { success: false, message: "Please correct the listing fields." };
  const result = await createApiListing(formData);
  if (result.success) {
    revalidatePath("/marketplace");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");
  }
  return result;
}

export async function updateListingAction(id: string, formData: FormData) {
  const parsed = listingSchema.safeParse(listingValuesFromFormData(formData));
  if (!parsed.success) return { success: false, message: "Please correct the listing fields." };
  const result = await updateApiListing(id, formData);
  if (result.success) {
    revalidatePath(`/marketplace/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");
  }
  return result;
}

export async function deleteListingAction(id: string) {
  const result = await deleteApiListing(id);
  if (result.success) {
    revalidatePath("/marketplace");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");
  }
  return result;
}
