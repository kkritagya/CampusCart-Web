"use server";

import {
  fetchNotifications,
  markAllApiNotificationsRead,
  markApiConversationRead,
  markApiNotificationRead,
  openApiConversation,
  saveApiListing,
  sendApiMessage,
  unsaveApiListing,
} from "@/lib/api/social_api";
import { revalidatePath } from "next/cache";

export async function saveListingAction(id: string) {
  const result = await saveApiListing(id);
  if (result.success) revalidatePath("/saved");
  return result;
}

export async function unsaveListingAction(id: string) {
  const result = await unsaveApiListing(id);
  if (result.success) revalidatePath("/saved");
  return result;
}

export async function openConversationAction(listingId: string) {
  return openApiConversation(listingId);
}

export async function sendMessageAction(conversationId: string, body: string) {
  const result = await sendApiMessage(conversationId, body);
  if (result.success) {
    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);
  }
  return result;
}

export async function markConversationReadAction(conversationId: string) {
  const result = await markApiConversationRead(conversationId);
  if (result.success) revalidatePath("/messages");
  return result;
}

export async function getNotificationsAction() {
  return fetchNotifications();
}

export async function markNotificationReadAction(notificationId: string) {
  return markApiNotificationRead(notificationId);
}

export async function markAllNotificationsReadAction() {
  return markAllApiNotificationsRead();
}
