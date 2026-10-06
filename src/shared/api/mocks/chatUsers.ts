import { UserProfile } from '@/entities/types';
import { mockCars } from './cars';
import { mockGuides } from './guides';
import { mockCurrentUser } from './user';

const baseProfile = {
  bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  daysTravelled: 0,
  tripsCount: 0,
  languages: [
    { name: 'Кыргызский', level: 'Native' },
    { name: 'Русский', level: 'Fluent' },
  ],
  visitedRegions: [],
};

const aidar = mockCars.find((car) => car.owner.id === 'host-aidar')!.owner;
const ruslan = mockGuides.find((guide) => guide.id === 'guide-8')!;

/** Car owner account — owns "Toyota 4Runner". */
export const mockHostUser: UserProfile = {
  ...baseProfile,
  id: aidar.id,
  name: 'Айдар',
  fullName: aidar.name,
  email: 'aidar.cars@example.kg',
  phone: '+996 555 10-20-30',
  avatarUrl: aidar.avatar,
  bio: 'Сдаю подготовленные внедорожники для поездок по горам Кыргызстана.',
  role: 'host',
  memberSince: '12.03.2022',
};

/** Guide account — the guide is the owner of their own listing. */
export const mockGuideUser: UserProfile = {
  ...baseProfile,
  id: ruslan.id,
  name: ruslan.name,
  fullName: ruslan.fullName ?? ruslan.name,
  email: 'ruslan.batken@example.kg',
  phone: ruslan.phone ?? '',
  avatarUrl: ruslan.avatarUrl,
  bio: ruslan.bio,
  role: 'guide',
  memberSince: '01.06.2021',
};

const otherTourist: UserProfile = {
  ...baseProfile,
  id: 'user-artem-2',
  name: 'Артём',
  fullName: 'Артём В.',
  email: 'artem@example.com',
  phone: '',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  bio: '',
  role: 'tourist',
  memberSince: '10.01.2024',
};

/** Accounts that can be signed into while the app runs on mock data. */
export const mockDemoAccounts: UserProfile[] = [mockCurrentUser, mockHostUser, mockGuideUser];

export interface ChatUserRecord {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserProfile['role'];
}

const toRecord = (user: UserProfile): ChatUserRecord => ({
  id: user.id,
  name: user.fullName,
  avatarUrl: user.avatarUrl,
  role: user.role,
});

/** Directory of every user the mock chat backend knows about. */
export const mockChatUsers: Record<string, ChatUserRecord> = Object.fromEntries(
  [
    ...[mockCurrentUser, mockHostUser, mockGuideUser, otherTourist].map(toRecord),
    ...mockCars.map((car) => ({
      id: car.owner.id,
      name: car.owner.name,
      avatarUrl: car.owner.avatar,
      role: 'host' as const,
    })),
    ...mockGuides.map((guide) => ({
      id: guide.id,
      name: guide.fullName ?? guide.name,
      avatarUrl: guide.avatarUrl,
      role: 'guide' as const,
    })),
  ].map((user) => [user.id, user]),
);

export const MOCK_OTHER_TOURIST_ID = otherTourist.id;

const REGISTERED_KEY = 'konok_registered_user';

/** Looks a user up in the mock directory, including an account created via registration. */
export const findChatUser = (id: string): ChatUserRecord | undefined => {
  if (mockChatUsers[id]) return mockChatUsers[id];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_KEY) : null;
    const user = raw ? (JSON.parse(raw) as UserProfile) : null;
    return user && user.id === id ? toRecord(user) : undefined;
  } catch {
    return undefined;
  }
};
