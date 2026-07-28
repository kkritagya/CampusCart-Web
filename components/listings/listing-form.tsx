"use client";

import { Button } from "@/components/ui/button";
import {
  marketplaceCampuses,
  marketplaceCategories,
  marketplaceConditions,
} from "@/lib/data/marketplace";
import {
  listingSchema,
  type ListingFormValues,
  type ValidListingValues,
} from "@/lib/validation/listing";
import { useState, type FormEvent } from "react";
import styles from "./listing-form.module.css";

type Props = {
  initialValues?: Partial<ListingFormValues>;
  submitLabel: string;
  onSubmit: (values: ValidListingValues, images: File[]) => void | Promise<void>;
};

const defaults: ListingFormValues = {
  title: "",
  description: "",
  price: "",
  category: "Electronics",
  condition: "Good",
  campus: "Main Campus",
  tags: "",
  visualTone: "tech",
};

export function ListingForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<ListingFormValues>({
    ...defaults,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);

  const update = (name: keyof ListingFormValues, value: string) => {
    setValues((current) => {
      if (name !== "category") return { ...current, [name]: value };
      const visualTone =
        value === "Books"
          ? "book"
          : value === "Furniture"
            ? "home"
            : value === "Electronics"
              ? "tech"
              : "accessory";
      return {
        ...current,
        category: value as ListingFormValues["category"],
        visualTone,
      };
    });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = listingSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    void onSubmit(parsed.data, images);
  };

  return (
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.grid}>
          <Field label="Title" name="title" error={errors.title} full>
            <input id="title" maxLength={80} value={String(values.title)} onChange={(e) => update("title", e.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : "title-hint"} required />
            <p id="title-hint" className={styles.hint}>3–80 characters</p>
          </Field>
          <Field label="Description" name="description" error={errors.description} full>
            <textarea id="description" maxLength={800} value={String(values.description)} onChange={(e) => update("description", e.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : "description-hint"} required />
            <p id="description-hint" className={styles.hint}>Describe the item and its condition.</p>
          </Field>
          <Field label="Price (NPR)" name="price" error={errors.price}>
            <input id="price" type="number" min="1" step="1" inputMode="numeric" value={String(values.price)} onChange={(e) => update("price", e.target.value)} aria-invalid={Boolean(errors.price)} required />
          </Field>
          <Field label="Category" name="category" error={errors.category}>
            <select id="category" value={String(values.category)} onChange={(e) => update("category", e.target.value)} required>{marketplaceCategories.map((item)=><option key={item}>{item}</option>)}</select>
          </Field>
          <Field label="Condition" name="condition" error={errors.condition}>
            <select id="condition" value={String(values.condition)} onChange={(e) => update("condition", e.target.value)} required>{marketplaceConditions.map((item)=><option key={item}>{item}</option>)}</select>
          </Field>
          <Field label="Campus pickup" name="campus" error={errors.campus}>
            <select id="campus" value={String(values.campus)} onChange={(e) => update("campus", e.target.value)} required>{marketplaceCampuses.map((item)=><option key={item}>{item}</option>)}</select>
          </Field>
          <Field label="Tags (optional)" name="tags" error={errors.tags}>
            <input id="tags" maxLength={120} value={String(values.tags ?? "")} onChange={(e) => update("tags", e.target.value)} placeholder="study, laptop" />
          </Field>
          <Field label="Product images (optional)" name="images" full>
            <input id="images" type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={(event)=>setImages(Array.from(event.target.files??[]).slice(0,6))} />
            <p className={styles.hint}>Up to 6 JPG, PNG, GIF, or WEBP files, 5 MB each.</p>
            {images.length?<p className={styles.hint}>{images.length} {images.length===1?"image":"images"} selected</p>:null}
          </Field>
        </div>
        <div className={styles.actions}>
          <Button type="submit" size="large">{submitLabel}</Button>
          <Button href="/dashboard/listings" variant="ghost">Cancel</Button>
        </div>
      </form>
    </div>
  );
}

function Field({label,name,error,full=false,children}:{label:string;name:string;error?:string;full?:boolean;children:React.ReactNode}) {
  return <label className={`${styles.field} ${full ? styles.full : ""}`} htmlFor={name}><span>{label} {!label.includes("optional") ? <span className={styles.required} aria-hidden="true">*</span> : null}</span>{children}{error ? <p id={`${name}-error`} className={styles.error}>{error}</p> : null}</label>;
}
