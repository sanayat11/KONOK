import { create } from 'zustand';
import { UserProfile } from '@/entities/types';
import { mockCurrentUser } from '@/shared/api/mocks/user';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  selectedRole: 'tourist' | 'host' | null;
  touristForm: {
    fullName: string;
    phone: string;
    email: string;
    termsAccepted: boolean;
    verificationMethod: 'whatsapp' | 'sms';
    otpCode: string[];
  };
  hostForm: {
    fullName: string;
    phone: string;
    email: string;
    about: string;
    region: string;
    languages: string[];
    pricePerDay: number;
    services: string[];
    idType: 'national' | 'international';
    avatarUrl: string;
  };
  setSelectedRole: (role: 'tourist' | 'host' | null) => void;
  updateTouristForm: (data: Partial<AuthState['touristForm']>) => void;
  updateHostForm: (data: Partial<AuthState['hostForm']>) => void;
  login: (user?: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: mockCurrentUser,
  selectedRole: null,
  touristForm: {
    fullName: 'Айбек Садыков',
    phone: '+996 770 12-34-56',
    email: 'aibek@example.kg',
    termsAccepted: true,
    verificationMethod: 'whatsapp',
    otpCode: ['', '', '', ''],
  },
  hostForm: {
    fullName: 'Руслан Кайрат уулу',
    phone: '+996 702 11-22-33',
    email: 'ruslan.batken@example.kg',
    about: 'Родился и вырос в Баткене. Люблю горы и традиции!',
    region: 'Баткенская область',
    languages: ['Кыргызский', 'Русский'],
    pricePerDay: 3500,
    services: ['Пешие походы', 'Юрты', 'Аренда лошадей'],
    idType: 'national',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  setSelectedRole: (role) => set({ selectedRole: role }),
  updateTouristForm: (data) =>
    set((state) => ({ touristForm: { ...state.touristForm, ...data } })),
  updateHostForm: (data) =>
    set((state) => ({ hostForm: { ...state.hostForm, ...data } })),
  login: (user) => set({ isAuthenticated: true, user: user || mockCurrentUser }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
