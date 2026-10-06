// Chat domain types (tourist ↔ listing owner). Frontend-only, backed by mock data.

export type ChatRole = 'tourist' | 'owner';

export type ChatListingType = 'car' | 'guide';

export interface ChatListing {
  id: string;
  type: ChatListingType;
  title: string;
  photoUrl: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
  readAt: string | null; // ISO — when the recipient read it
}

/** Stored conversation between one tourist and the owner of one listing. */
export interface ChatThread {
  id: string;
  listing: ChatListing;
  touristId: string;
  ownerId: string;
  updatedAt: string; // ISO
}

/**
 * A thread as seen by a given user: `role` is that user's side and
 * `participant` is always the other person.
 */
export interface Conversation {
  id: string;
  listing: ChatListing;
  role: ChatRole;
  participant: ChatParticipant;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}
