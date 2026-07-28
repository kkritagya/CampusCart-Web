import {
  type MarketplaceProduct,
  type MarketplaceVisualTone,
} from "@/lib/data/marketplace";
import { apiRequest } from "./axios-instance";
import { API_BASE_URL, LISTING_ENDPOINTS } from "./endpoint";

export type ListingApiItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: MarketplaceProduct["category"];
  condition: MarketplaceProduct["condition"];
  campus: MarketplaceProduct["campus"];
  status: NonNullable<MarketplaceProduct["status"]>;
  verificationStatus?: NonNullable<MarketplaceProduct["verificationStatus"]>;
  moderationReason?: string;
  tags: string[];
  images: string[];
  seller: { id: string; fullName: string; profilePicture?: string };
  views: number;
  enquiries: number;
  createdAt?: string;
  updatedAt?: string;
};

type ListingPage = {
  items: ListingApiItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

function toneForCategory(category: MarketplaceProduct["category"]): MarketplaceVisualTone {
  if (category === "Books") return "book";
  if (category === "Furniture") return "home";
  if (category === "Electronics") return "tech";
  return "accessory";
}

export function mapApiListing(item: ListingApiItem): MarketplaceProduct {
  const visualTone = toneForCategory(item.category);
  const createdAt = item.createdAt ?? new Date().toISOString();
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    condition: item.condition,
    campus: item.campus,
    status: item.status,
    verificationStatus: item.verificationStatus ?? "Pending",
    moderationReason: item.moderationReason,
    tags: item.tags,
    sellerId: item.seller.id,
    sellerName: item.seller.fullName,
    ownerId: item.seller.id,
    views: item.views,
    enquiries: item.enquiries,
    verified: item.verificationStatus === "Verified",
    postedAt: createdAt,
    postedLabel: new Intl.DateTimeFormat("en-NP", {
      month: "short",
      day: "numeric",
    }).format(new Date(createdAt)),
    visualTone,
    images: item.images.length
      ? item.images.map((src, index) => ({
          label: `${item.title}, image ${index + 1}`,
          tone: visualTone,
          variant: index === 0 ? "primary" as const : "detail" as const,
          src: `/api/uploads/${src.replace(/^\/?uploads\//, "")}`,
        }))
      : [
          { label: `${item.title}, primary view`, tone: visualTone, variant: "primary" },
          { label: `${item.title}, condition detail`, tone: visualTone, variant: "detail" },
        ],
  };
}

export async function fetchListings() {
  const result = await apiRequest<ListingPage>(
    `${LISTING_ENDPOINTS.list}?limit=50`,
    { baseUrl: API_BASE_URL }
  );
  return result.success
    ? { ...result, data: result.data.items.map(mapApiListing) }
    : result;
}

export async function fetchListing(id: string) {
  const result = await apiRequest<ListingApiItem>(`/listings/${id}`, {
    baseUrl: API_BASE_URL,
  });
  return result.success ? { ...result, data: mapApiListing(result.data) } : result;
}

export async function fetchMyListings() {
  const result = await apiRequest<ListingApiItem[]>(LISTING_ENDPOINTS.mine, {
    baseUrl: API_BASE_URL,
    authenticated: true,
  });
  return result.success
    ? { ...result, data: result.data.map(mapApiListing) }
    : result;
}

export function createApiListing(formData: FormData) {
  return apiRequest<ListingApiItem>(LISTING_ENDPOINTS.list, {
    method: "POST",
    authenticated: true,
    baseUrl: API_BASE_URL,
    body: formData,
  });
}

export function updateApiListing(id: string, formData: FormData) {
  return apiRequest<ListingApiItem>(`/listings/${id}`, {
    method: "PUT",
    authenticated: true,
    baseUrl: API_BASE_URL,
    body: formData,
  });
}

export function deleteApiListing(id: string) {
  return apiRequest<undefined>(`/listings/${id}`, {
    method: "DELETE",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}
