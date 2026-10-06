import { UserProfile } from '@/entities/types';

export const mockCurrentUser: UserProfile = {
  id: 'user-leila-1',
  name: 'Лейла',
  fullName: 'Лейла К.',
  email: 'leila.travels@example.kg',
  phone: '+996 700 88-99-00',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
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
    { name: 'Ош', photoUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=300&q=80' },
    { name: 'Нарын', photoUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80' },
    { name: 'Ысык-Көл', photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80' },
    { name: 'Баткен', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Талас', photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80' },
    { name: 'Чуй', photoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80' },
  ],
};
