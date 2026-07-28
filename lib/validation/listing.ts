import {
  marketplaceCampuses,
  marketplaceCategories,
  marketplaceConditions,
} from "@/lib/data/marketplace";
import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters.").max(80),
  description: z.string().trim().min(20, "Use at least 20 characters.").max(800),
  price: z.coerce.number().positive("Enter a price greater than zero."),
  category: z.enum(marketplaceCategories),
  condition: z.enum(marketplaceConditions),
  campus: z.enum(marketplaceCampuses),
  tags: z.string().trim().max(120).optional(),
  visualTone: z.enum(["book", "tech", "home", "accessory"]),
});

export type ListingFormValues = z.input<typeof listingSchema>;
export type ValidListingValues = z.output<typeof listingSchema>;
