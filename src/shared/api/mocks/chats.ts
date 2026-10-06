import type { ChatListing, ChatListingType, ChatMessage, ChatThread } from '@/entities/chat/model/types';
import { mockCars } from './cars';
import { mockGuides } from './guides';
import { mockCurrentUser } from './user';
import { MOCK_OTHER_TOURIST_ID, mockGuideUser, mockHostUser } from './chatUsers';

/** Listing shown in the chat header plus the user who owns it. */
export const findChatListing = (
  type: ChatListingType,
  id: string,
): { listing: ChatListing; ownerId: string } | null => {
  if (type === 'car') {
    const car = mockCars.find((item) => item.id === id);
    return car
      ? { listing: { id, type, title: car.name, photoUrl: car.photoUrl }, ownerId: car.owner.id }
      : null;
  }
  const guide = mockGuides.find((item) => item.id === id);
  return guide
    ? {
        listing: { id, type, title: guide.roleTitle, photoUrl: guide.gallery[0] ?? guide.avatarUrl },
        ownerId: guide.id,
      }
    : null;
};

/** Initial conversations, timed relative to "now" so timestamps look fresh. */
export const createMockChatData = (now = Date.now()): { threads: ChatThread[]; messages: ChatMessage[] } => {
  const at = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();
  const car = findChatListing('car', 'car-toyota-4runner')!.listing;
  const guide = findChatListing('guide', mockGuideUser.id)!.listing;
  const tourist = mockCurrentUser.id;

  const threads: ChatThread[] = [
    { id: 'thread-car', listing: car, touristId: tourist, ownerId: mockHostUser.id, updatedAt: at(12) },
    { id: 'thread-guide', listing: guide, touristId: tourist, ownerId: mockGuideUser.id, updatedAt: at(1420) },
    { id: 'thread-other', listing: car, touristId: MOCK_OTHER_TOURIST_ID, ownerId: mockHostUser.id, updatedAt: at(240) },
  ];

  let seq = 0;
  const msg = (threadId: string, senderId: string, text: string, minutesAgo: number, read = true): ChatMessage => ({
    id: `mock-msg-${++seq}`,
    threadId,
    senderId,
    text,
    createdAt: at(minutesAgo),
    readAt: read ? at(Math.max(minutesAgo - 1, 0)) : null,
  });

  const messages: ChatMessage[] = [
    msg('thread-car', tourist, 'Здравствуйте! Свободна ли Toyota 4Runner с 24 по 28 сентября?', 2900),
    msg('thread-car', mockHostUser.id, 'Добрый день, Лейла! Да, на эти даты машина свободна.', 2880),
    msg('thread-car', tourist, 'Отлично. Можно подачу в аэропорт Манас?', 2878),
    msg('thread-car', mockHostUser.id, 'Да, подача в Манас бесплатная. Во сколько прилетаете?', 14, false),
    msg('thread-car', mockHostUser.id, 'И подскажите, нужен ли второй водитель?', 12, false),
    msg('thread-guide', tourist, 'Руслан, здравствуйте! Хотим поход в Айгүл-Таш на 2 дня, нас трое.', 1500),
    msg('thread-guide', mockGuideUser.id, 'Здравствуйте! С радостью. Предлагаю выезд из Баткена в 7 утра, ночёвка в юрте.', 1440),
    msg('thread-guide', tourist, 'Звучит прекрасно, спасибо! Забронирую на сайте.', 1420),
    msg('thread-other', MOCK_OTHER_TOURIST_ID, 'Добрый день! Есть ли в машине багажник на крышу?', 300),
    msg('thread-other', mockHostUser.id, 'Здравствуйте, Артём! Да, есть экспедиционный багажник.', 240, false),
  ];

  return { threads, messages };
};
