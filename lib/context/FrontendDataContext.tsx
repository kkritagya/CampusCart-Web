"use client";

import { fixtureConversations } from "@/lib/data/messages";
import {
  CURRENT_FIXTURE_USER_ID,
  marketplaceProducts,
  marketplaceSellers,
  type MarketplaceProduct,
} from "@/lib/data/marketplace";
import type { Conversation } from "@/lib/types/message";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type FrontendData = {
  listings: MarketplaceProduct[];
  savedIds: string[];
  conversations: Conversation[];
};

type FrontendDataContextValue = FrontendData & {
  createListing: (listing: MarketplaceProduct) => void;
  updateListing: (listing: MarketplaceProduct) => void;
  deleteListing: (id: string) => void;
  toggleSaved: (id: string) => void;
  ensureConversation: (listingId: string) => string;
  markConversationRead: (id: string) => void;
  sendMessage: (conversationId: string, body: string) => boolean;
};

const STORAGE_KEY = "campuscart.frontend-data.v1";
const initialData: FrontendData = {
  listings: marketplaceProducts,
  savedIds: ["sony-headphones"],
  conversations: fixtureConversations,
};

let snapshot = initialData;
let loaded = false;
const listeners = new Set<() => void>();

function isStoredData(value: unknown): value is FrontendData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.listings) &&
    Array.isArray(candidate.savedIds) &&
    Array.isArray(candidate.conversations)
  );
}

function loadSnapshot() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isStoredData(parsed)) snapshot = parsed;
    }
  } catch {
    snapshot = initialData;
  }
}

function getSnapshot() {
  loadSnapshot();
  return snapshot;
}

function getServerSnapshot() {
  return initialData;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: FrontendData) {
  snapshot = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The UI remains functional when browser storage is unavailable.
    }
  }
  listeners.forEach((listener) => listener());
}

const FrontendDataContext = createContext<FrontendDataContextValue | null>(null);

export function FrontendDataProvider({
  children,
  apiListings,
}: {
  children: ReactNode;
  apiListings?: MarketplaceProduct[];
}) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const createListing = useCallback((listing: MarketplaceProduct) => {
    commit({ ...snapshot, listings: [listing, ...snapshot.listings] });
  }, []);

  const updateListing = useCallback((listing: MarketplaceProduct) => {
    commit({
      ...snapshot,
      listings: snapshot.listings.map((item) =>
        item.id === listing.id ? listing : item
      ),
    });
  }, []);

  const deleteListing = useCallback((id: string) => {
    commit({
      ...snapshot,
      listings: snapshot.listings.filter((item) => item.id !== id),
      savedIds: snapshot.savedIds.filter((savedId) => savedId !== id),
    });
  }, []);

  const toggleSaved = useCallback((id: string) => {
    const savedIds = snapshot.savedIds.includes(id)
      ? snapshot.savedIds.filter((savedId) => savedId !== id)
      : [...snapshot.savedIds, id];
    commit({ ...snapshot, savedIds });
  }, []);

  const ensureConversation = useCallback((listingId: string) => {
    const existing = snapshot.conversations.find(
      (conversation) => conversation.listingId === listingId
    );
    if (existing) return existing.id;

    const listing = snapshot.listings.find((item) => item.id === listingId);
    const id = `conversation-${listingId}-${Date.now()}`;
    const conversation: Conversation = {
      id,
      listingId,
      otherParticipantId: listing?.sellerId ?? "seller",
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    commit({
      ...snapshot,
      conversations: [conversation, ...snapshot.conversations],
    });
    return id;
  }, []);

  const markConversationRead = useCallback((id: string) => {
    const conversations = snapshot.conversations.map((conversation) =>
      conversation.id === id
        ? {
            ...conversation,
            unreadCount: 0,
            messages: conversation.messages.map((message) => ({
              ...message,
              read: true,
            })),
          }
        : conversation
    );
    commit({ ...snapshot, conversations });
  }, []);

  const sendMessage = useCallback((conversationId: string, rawBody: string) => {
    const body = rawBody.trim();
    if (!body) return false;
    const timestamp = new Date().toISOString();
    const conversations = snapshot.conversations
      .map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              updatedAt: timestamp,
              messages: [
                ...conversation.messages,
                {
                  id: `message-${Date.now()}`,
                  senderId: CURRENT_FIXTURE_USER_ID,
                  body,
                  timestamp,
                  read: true,
                },
              ],
            }
          : conversation
      )
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    commit({ ...snapshot, conversations });
    return true;
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      listings: apiListings ?? data.listings,
      createListing,
      updateListing,
      deleteListing,
      toggleSaved,
      ensureConversation,
      markConversationRead,
      sendMessage,
    }),
    [
      createListing,
      data,
      apiListings,
      deleteListing,
      ensureConversation,
      markConversationRead,
      sendMessage,
      toggleSaved,
      updateListing,
    ]
  );

  return (
    <FrontendDataContext.Provider value={value}>
      {children}
    </FrontendDataContext.Provider>
  );
}

export function useFrontendData() {
  const context = useContext(FrontendDataContext);
  if (!context) {
    throw new Error("useFrontendData must be used inside FrontendDataProvider");
  }
  return context;
}

export function getFixtureSellerName(id: string) {
  return marketplaceSellers[id]?.name ?? "CampusCart student";
}
