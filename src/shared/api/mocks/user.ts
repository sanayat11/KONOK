import { UserProfile } from '@/entities/types';

export const mockCurrentUser: UserProfile = {
  id: 'user-leila-1',
  name: 'Лейла',
  fullName: 'Лейла К.',
  email: 'leila.travels@example.kg',
  phone: '+996 700 88-99-00',
  avatarUrl: '/images/people/guest-leila.jpg',
  bannerUrl: '/images/son-kul-shore-1440.jpg',
  bio: 'Люблю путешествовать, открывать новые места и знакомиться с местными жителями. Особенно вдохновляют горы, озера и культура стран.',
  role: 'tourist',
  daysTravelled: 14,
  tripsCount: 4,
  memberSince: '05.05.2023',
  country: 'USA',
  birthDate: '12.12.1999',
  interests: ['Горы', 'Природа', 'Лошади', 'Культура', 'Кемпинг', 'Кухня'],
  languages: [
    { name: 'Английский', level: 'Native' },
    { name: 'Русский', level: 'Fluent' },
  ],
  visitedRegions: [
    { name: 'Ош', photoUrl: '/images/sulaiman-too-720.jpg' },
    { name: 'Нарын', photoUrl: '/images/tash-rabat-720.jpg' },
    { name: 'Ысык-Көл', photoUrl: '/images/issyk-kul-shore-720.jpg' },
    { name: 'Баткен', photoUrl: '/images/sulaiman-too-rocks-720.jpg' },
    { name: 'Талас', photoUrl: '/images/horse-pasture-720.jpg' },
    { name: 'Чуй', photoUrl: '/images/burana-720.jpg' },
  ],
};
