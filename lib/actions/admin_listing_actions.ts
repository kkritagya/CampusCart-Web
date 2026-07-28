"use server";

import { apiRequest } from "@/lib/api/axios-instance";
import { API_BASE_URL } from "@/lib/api/endpoint";
import { mapApiListing, type ListingApiItem } from "@/lib/api/listing_api";

export async function getAdminListings() {
  const result = await apiRequest<ListingApiItem[]>("/admin/listings?status=All", { baseUrl: API_BASE_URL });
  return result.success
    ? { ...result, data: result.data.map(mapApiListing) }
    : result;
}

export async function approveAdminListing(id: string) {
  const result = await apiRequest<ListingApiItem>(`/admin/listings/${id}/approve`, { baseUrl: API_BASE_URL, method: "PATCH" });
  return result.success ? { ...result, data: mapApiListing(result.data) } : result;
}

export async function rejectAdminListing(id: string, reason: string) {
  const result = await apiRequest<ListingApiItem>(`/admin/listings/${id}/reject`, { baseUrl: API_BASE_URL, method: "PATCH", body: { reason } });
  return result.success ? { ...result, data: mapApiListing(result.data) } : result;
}

export async function deleteAdminListing(id: string) {
  return apiRequest<void>(`/admin/listings/${id}`, { baseUrl: API_BASE_URL, method: "DELETE" });
}
