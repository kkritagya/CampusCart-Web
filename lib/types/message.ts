export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  timestamp: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  listingId: string;
  otherParticipantId: string;
  unreadCount: number;
  updatedAt: string;
  messages: ChatMessage[];
};
