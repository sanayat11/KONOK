import type { ChatMessage } from '../model/types';

const LOCALE = 'ru-RU';
const GROUP_WINDOW_MS = 5 * 60 * 1000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const daysAgo = (date: Date, now = new Date()) =>
  Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

export const formatMessageTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });

/** Time shown in the conversation list: "14:05", "Вчера", "пн", "12.09.26". */
export const formatConversationTime = (iso: string, now = new Date()) => {
  const date = new Date(iso);
  const diff = daysAgo(date, now);
  if (diff <= 0) return formatMessageTime(iso);
  if (diff === 1) return 'Вчера';
  if (diff < 7) return date.toLocaleDateString(LOCALE, { weekday: 'short' });
  return date.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: '2-digit' });
};

/** Day separator label inside a conversation: "Сегодня", "Вчера", "5 октября". */
export const formatDayLabel = (iso: string, now = new Date()) => {
  const date = new Date(iso);
  const diff = daysAgo(date, now);
  if (diff <= 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  return date.toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  });
};

export interface MessageGroup {
  key: string;
  senderId: string;
  messages: ChatMessage[];
}

export interface MessageDay {
  key: string;
  label: string;
  groups: MessageGroup[];
}

/**
 * Splits messages into days, and each day into runs of consecutive messages
 * from the same sender sent within a few minutes of each other.
 */
export const groupMessages = (messages: ChatMessage[], now = new Date()): MessageDay[] => {
  const days: MessageDay[] = [];

  for (const message of messages) {
    const created = new Date(message.createdAt);
    const dayKey = String(startOfDay(created));
    let day = days[days.length - 1];
    if (!day || day.key !== dayKey) {
      day = { key: dayKey, label: formatDayLabel(message.createdAt, now), groups: [] };
      days.push(day);
    }

    const group = day.groups[day.groups.length - 1];
    const prev = group?.messages[group.messages.length - 1];
    const sameRun =
      group &&
      group.senderId === message.senderId &&
      prev &&
      created.getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;

    if (sameRun) {
      group.messages.push(message);
    } else {
      day.groups.push({ key: message.id, senderId: message.senderId, messages: [message] });
    }
  }

  return days;
};

export const LISTING_TYPE_LABEL: Record<string, string> = {
  car: 'Аренда авто',
  guide: 'Услуги гида',
};
