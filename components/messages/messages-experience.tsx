"use client";

import { Button } from "@/components/ui/button";
import { markConversationReadAction, sendMessageAction } from "@/lib/actions/social_actions";
import type { ApiConversation } from "@/lib/api/social_api";
import type { ChatMessage } from "@/lib/types/message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import styles from "./messages.module.css";

const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });

export function MessagesExperience({
  conversations,
  activeId,
  initialMessages = [],
  currentUserId,
}: {
  conversations: ApiConversation[];
  activeId?: string;
  initialMessages?: ChatMessage[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const active = conversations.find((item) => item.id === activeId);
  const visibleConversations = conversations.filter((conversation) =>
    `${conversation.otherParticipant?.fullName ?? ""} ${conversation.listing?.title ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const open = async (id: string) => {
    await markConversationReadAction(id);
    router.push(`/messages/${id}`);
  };

  const send = async () => {
    if (!active) return;
    const body = draft.trim();
    if (!body) {
      setStatus("Write a message before sending.");
      return;
    }
    const result = await sendMessageAction(active.id, body);
    if (result.success) {
      setMessages((items) => [...items, result.data]);
      setDraft("");
      setStatus("");
    } else {
      setStatus(result.message);
    }
  };

  const handleKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  return (
    <div className={`${styles.shell} ${active ? styles.hasActive : ""}`}>
      <aside className={styles.sidebar} aria-label="Conversations">
        <h2>Messages</h2>
        <label className={styles.chatSearch}>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chats..." />
        </label>
        {visibleConversations.length ? visibleConversations.map((conversation) => (
          <Link
            href={`/messages/${conversation.id}`}
            onClick={(event) => {
              event.preventDefault();
              void open(conversation.id);
            }}
            aria-current={conversation.id === activeId ? "page" : undefined}
            className={`${styles.conversation} ${conversation.id === activeId ? styles.active : ""}`}
            key={conversation.id}
          >
            <div className={styles.row}>
              <strong>{conversation.otherParticipant?.fullName ?? "CampusCart student"}</strong>
              {conversation.unreadCount ? <span className={styles.unread}>{conversation.unreadCount}</span> : null}
            </div>
            <p>{conversation.listing?.title ?? "Listing unavailable"}</p>
            <p>{conversation.lastMessage || "Start the conversation"}</p>
          </Link>
        )) : (
          <div className={styles.empty}>
            <div><h2>No conversations</h2><p>Contact a seller from a product page to begin.</p><Button href="/marketplace">Browse marketplace</Button></div>
          </div>
        )}
      </aside>

      <section className={styles.chat} aria-label="Active conversation">
        {active ? <>
          <header className={styles.chatHeader}>
            <button type="button" className={styles.back} onClick={() => router.push("/messages")}>← All conversations</button>
            <h2>{active.otherParticipant?.fullName ?? "CampusCart student"}</h2>
            <p>{active.listing?.title ?? "Listing unavailable"}</p>
          </header>
          <div className={styles.messages} aria-live="polite">
            {messages.length ? messages.map((message) => (
              <article className={`${styles.bubble} ${message.senderId === currentUserId ? styles.mine : ""}`} key={message.id}>
                <p>{message.body}</p>
                <time dateTime={message.timestamp}>{time.format(new Date(message.timestamp))}</time>
              </article>
            )) : <div className={styles.empty}>No messages yet. Ask about pickup or item condition.</div>}
          </div>
          <div className={styles.composer}>
            <label>
              <span className="sr-only">Message</span>
              <textarea value={draft} onChange={(event) => { setDraft(event.target.value); setStatus(""); }} onKeyDown={handleKey} placeholder="Type your message..." aria-describedby="message-status" />
            </label>
            <Button type="button" onClick={() => void send()} aria-label="Send message">➤</Button>
          </div>
          <p id="message-status" className={styles.notice} aria-live="polite">
            {status || "Campus Safety Tip: Always meet in well-lit public areas."}
          </p>
        </> : (
          <div className={styles.empty}><div><h2>Select a conversation</h2><p>Choose a conversation to read and reply.</p></div></div>
        )}
      </section>
    </div>
  );
}
