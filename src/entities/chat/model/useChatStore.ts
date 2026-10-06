import { useMemo } from 'react';
import { create } from 'zustand';
import { createMockChatData, findChatListing } from '@/shared/api/mocks/chats';
import { findChatUser } from '@/shared/api/mocks/chatUsers';
import type { ChatListingType, ChatMessage, ChatThread, Conversation } from './types';

const STORAGE_KEY = 'konok_chat';

interface ChatData {
  threads: ChatThread[];
  messages: ChatMessage[];
}

interface ChatState extends ChatData {
  sendMessage: (threadId: string, senderId: string, text: string) => void;
  markAsRead: (threadId: string, readerId: string) => void;
  /** Returns the tourist's thread for a listing, creating it if needed. */
  openThread: (listingType: ChatListingType, listingId: string, touristId: string) => string | null;
}

const loadData = (): ChatData => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as ChatData;
    } catch {
      // corrupted or blocked storage: fall back to mock data
    }
  }
  return createMockChatData();
};

const saveData = ({ threads, messages }: ChatData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ threads, messages }));
  } catch {
    // storage unavailable: state still lives in memory
  }
};

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useChatStore = create<ChatState>((set, get) => {
  const commit = (data: Partial<ChatData>) => {
    set(data);
    saveData(get());
  };

  return {
    ...loadData(),

    sendMessage: (threadId, senderId, rawText) => {
      const text = rawText.trim();
      if (!text) return;
      const message: ChatMessage = {
        id: newId('msg'),
        threadId,
        senderId,
        text,
        createdAt: new Date().toISOString(),
        readAt: null,
      };
      const { threads, messages } = get();
      commit({
        messages: [...messages, message],
        threads: threads.map((t) => (t.id === threadId ? { ...t, updatedAt: message.createdAt } : t)),
      });
    },

    markAsRead: (threadId, readerId) => {
      const { messages } = get();
      if (!messages.some((m) => m.threadId === threadId && m.senderId !== readerId && !m.readAt)) return;
      const now = new Date().toISOString();
      commit({
        messages: messages.map((m) =>
          m.threadId === threadId && m.senderId !== readerId && !m.readAt ? { ...m, readAt: now } : m,
        ),
      });
    },

    openThread: (listingType, listingId, touristId) => {
      const { threads } = get();
      const existing = threads.find(
        (t) => t.touristId === touristId && t.listing.type === listingType && t.listing.id === listingId,
      );
      if (existing) return existing.id;

      const found = findChatListing(listingType, listingId);
      if (!found || found.ownerId === touristId) return null;
      const thread: ChatThread = {
        id: newId('thread'),
        listing: found.listing,
        touristId,
        ownerId: found.ownerId,
        updatedAt: new Date().toISOString(),
      };
      commit({ threads: [thread, ...threads] });
      return thread.id;
    },
  };
});

// Keep several open tabs in sync (e.g. tourist in one tab, owner in another).
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      useChatStore.setState(JSON.parse(event.newValue) as ChatData);
    }
  });
}

const toConversation = (thread: ChatThread, messages: ChatMessage[], userId: string): Conversation => {
  const isTourist = thread.touristId === userId;
  const otherId = isTourist ? thread.ownerId : thread.touristId;
  const other = findChatUser(otherId);
  const own = messages.filter((m) => m.threadId === thread.id);

  return {
    id: thread.id,
    listing: thread.listing,
    role: isTourist ? 'tourist' : 'owner',
    participant: { id: otherId, name: other?.name ?? 'Пользователь', avatarUrl: other?.avatarUrl ?? '' },
    lastMessage: own[own.length - 1] ?? null,
    unreadCount: own.filter((m) => m.senderId !== userId && !m.readAt).length,
    updatedAt: thread.updatedAt,
  };
};

/**
 * Conversations the user takes part in, newest first. Owners only see a thread
 * once the tourist has written something.
 */
export const useConversations = (userId: string | undefined): Conversation[] => {
  const threads = useChatStore((s) => s.threads);
  const messages = useChatStore((s) => s.messages);

  return useMemo(() => {
    if (!userId) return [];
    return threads
      .filter((t) => t.touristId === userId || t.ownerId === userId)
      .filter((t) => t.touristId === userId || messages.some((m) => m.threadId === t.id))
      .map((t) => toConversation(t, messages, userId))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [threads, messages, userId]);
};

export const useThreadMessages = (threadId: string | undefined): ChatMessage[] => {
  const messages = useChatStore((s) => s.messages);
  return useMemo(
    () =>
      threadId
        ? messages.filter((m) => m.threadId === threadId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        : [],
    [messages, threadId],
  );
};

export const useUnreadCount = (userId: string | undefined) =>
  useConversations(userId).reduce((sum, c) => sum + c.unreadCount, 0);
