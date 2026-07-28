import { CURRENT_FIXTURE_USER_ID } from "./marketplace";
import type { Conversation } from "@/lib/types/message";

// Frontend-only conversation fixtures pending API integration.
export const fixtureConversations: Conversation[] = [
  {
    id: "conversation-monitor",
    listingId: "dell-ultrasharp-monitor",
    otherParticipantId: "aarav-karki",
    unreadCount: 1,
    updatedAt: "2026-07-25T12:10:00+05:45",
    messages: [
      {
        id: "message-monitor-1",
        senderId: CURRENT_FIXTURE_USER_ID,
        body: "Hi, is the monitor still available?",
        timestamp: "2026-07-25T11:50:00+05:45",
        read: true,
      },
      {
        id: "message-monitor-2",
        senderId: "aarav-karki",
        body: "Yes! I can meet near Engineering tomorrow afternoon.",
        timestamp: "2026-07-25T12:10:00+05:45",
        read: false,
      },
    ],
  },
  {
    id: "conversation-bike",
    listingId: "campus-bike",
    otherParticipantId: "maya-shrestha",
    unreadCount: 0,
    updatedAt: "2026-07-24T16:00:00+05:45",
    messages: [
      {
        id: "message-bike-1",
        senderId: "maya-shrestha",
        body: "The bike was serviced last week. You are welcome to test it.",
        timestamp: "2026-07-24T16:00:00+05:45",
        read: true,
      },
    ],
  },
];
