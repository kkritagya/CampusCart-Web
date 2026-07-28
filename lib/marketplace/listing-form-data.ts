import type { ValidListingValues } from "@/lib/validation/listing";

export function buildListingFormData(
  values: ValidListingValues,
  images: File[]
) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, String(value ?? ""));
  });
  images.forEach((image) => formData.append("images", image));
  return formData;
}

export function listingValuesFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    campus: formData.get("campus"),
    tags: formData.get("tags"),
    visualTone: formData.get("visualTone"),
  };
}
