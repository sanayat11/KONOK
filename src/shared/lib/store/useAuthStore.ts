import { create } from 'zustand';
import { UserProfile } from '@/entities/types';
import { mockCurrentUser } from '@/shared/api/mocks/user';
import { mockDemoAccounts } from '@/shared/api/mocks/chatUsers';

const SESSION_KEY = 'konok_session_user';
const REGISTERED_KEY = 'konok_registered_user';

/** Account created through the registration flow (frontend-only, kept in localStorage). */
export const loadRegisteredUser = (): UserProfile | null => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_KEY) : null;
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
};

const loadSessionUser = (): UserProfile => {
  try {
    const id = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
    const registered = loadRegisteredUser();
    if (registered && registered.id === id) return registered;
    return mockDemoAccounts.find((account) => account.id === id) ?? mockCurrentUser;
  } catch {
    return mockCurrentUser;
  }
};

const saveSessionUser = (id: string | null) => {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable
  }
};

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
    locality: string;
    address: string;
    maxGuests: number;
  };
  setSelectedRole: (role: 'tourist' | 'host' | null) => void;
  updateTouristForm: (data: Partial<AuthState['touristForm']>) => void;
  updateHostForm: (data: Partial<AuthState['hostForm']>) => void;
  login: (user?: UserProfile) => void;
  logout: () => void;
  /** Demo helper: sign in as another mock account (tourist / car owner / guide). */
  switchAccount: (userId: string) => void;
  /** Finishes the registration flow: stores the new account locally and signs in. */
  register: (user: UserProfile) => void;
  /** "Редактировать профиль": patch the signed-in user's profile. */
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: loadSessionUser(),
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
    locality: 'Айгүл-Таш',
    address: '',
    maxGuests: 2,
  },
  setSelectedRole: (role) => set({ selectedRole: role }),
  updateTouristForm: (data) =>
    set((state) => ({ touristForm: { ...state.touristForm, ...data } })),
  updateHostForm: (data) =>
    set((state) => ({ hostForm: { ...state.hostForm, ...data } })),
  login: (user) => {
    const next = user || mockCurrentUser;
    saveSessionUser(next.id);
    set({ isAuthenticated: true, user: next });
  },
  logout: () => {
    saveSessionUser(null);
    set({ isAuthenticated: false, user: null });
  },
  register: (user) => {
    try {
      localStorage.setItem(REGISTERED_KEY, JSON.stringify(user));
    } catch {
      // storage unavailable: the account lives for this session only
    }
    saveSessionUser(user.id);
    set({ isAuthenticated: true, user });
  },
  updateUser: (data) =>
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...data };
      // A registered (non-demo) account is persisted so edits survive a reload.
      if (loadRegisteredUser()?.id === user.id) {
        try {
          localStorage.setItem(REGISTERED_KEY, JSON.stringify(user));
        } catch {
          // ignore
        }
      }
      return { user };
    }),
  switchAccount: (userId) => {
    const account = mockDemoAccounts.find((item) => item.id === userId);
    if (!account) return;
    saveSessionUser(account.id);
    set({ isAuthenticated: true, user: account });
  },
}));
