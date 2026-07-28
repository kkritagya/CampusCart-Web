import type { MarketplaceProduct } from "@/lib/data/marketplace";
import type { ChatMessage } from "@/lib/types/message";
import { apiRequest } from "./axios-instance";
import { API_BASE_URL } from "./endpoint";
import { mapApiListing } from "./listing_api";

type ApiListing = Parameters<typeof mapApiListing>[0];
export type ApiConversation = {
  id: string;
  listing: { id: string; title: string } | null;
  otherParticipant: {
    id: string;
    fullName: string;
    profilePicture?: string;
  } | null;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
};

export type ApiNotification = {
  id: string;
  type: "message" | "sale" | "moderation";
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export async function fetchSavedListings() {
  const result = await apiRequest<ApiListing[]>("/saved", {
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
  return result.success
    ? { ...result, data: result.data.map(mapApiListing) }
    : result;
}

export function saveApiListing(id: string) {
  return apiRequest<ApiListing>(`/saved/${id}`, {
    method: "POST",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function unsaveApiListing(id: string) {
  return apiRequest<undefined>(`/saved/${id}`, {
    method: "DELETE",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function fetchConversations() {
  return apiRequest<ApiConversation[]>("/conversations", {
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function openApiConversation(listingId: string) {
  return apiRequest<ApiConversation>("/conversations", {
    method: "POST",
    authenticated: true,
    baseUrl: API_BASE_URL,
    body: { listingId },
  });
}

export function fetchConversationMessages(conversationId: string) {
  return apiRequest<ChatMessage[]>(
    `/conversations/${conversationId}/messages`,
    { authenticated: true, baseUrl: API_BASE_URL }
  );
}

export function sendApiMessage(conversationId: string, body: string) {
  return apiRequest<ChatMessage>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      authenticated: true,
      baseUrl: API_BASE_URL,
      body: { body },
    }
  );
}

export function markApiConversationRead(conversationId: string) {
  return apiRequest<undefined>(`/conversations/${conversationId}/read`, {
    method: "PATCH",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function fetchNotifications() {
  return apiRequest<ApiNotification[]>("/notifications", {
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function markApiNotificationRead(notificationId: string) {
  return apiRequest<undefined>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export function markAllApiNotificationsRead() {
  return apiRequest<undefined>("/notifications/read", {
    method: "PATCH",
    authenticated: true,
    baseUrl: API_BASE_URL,
  });
}

export type SavedListing = MarketplaceProduct;
