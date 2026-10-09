import { useMemo } from 'react';
import { create } from 'zustand';
import { createId } from '@/shared/lib/date';
import { mockStays } from '@/shared/api/mocks/stays';
import type { Stay, StayDraft, StayStatus } from './types';

const STORAGE_KEY = 'konok_host_stays';

/** `error` = the saved listings could not be read (corrupted or blocked storage). */
type LoadStatus = 'ready' | 'error';

export type StaySaveResult = { ok: true; stay: Stay } | { ok: false };

interface StaysState {
  /** Listings created in this browser (drafts and demo-published). */
  local: Stay[];
  status: LoadStatus;
  saveStay: (ownerId: string, draft: StayDraft, status: StayStatus, id?: string) => StaySaveResult;
  removeStay: (id: string) => boolean;
  reset: () => void;
}

const load = (): { local: Stay[]; status: LoadStatus } => {
  if (typeof window === 'undefined') return { local: [], status: 'ready' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { local: [], status: 'ready' };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('invalid');
    return { local: parsed as Stay[], status: 'ready' };
  } catch {
    return { local: [], status: 'error' };
  }
};

const persist = (local: Stay[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    return true;
  } catch {
    return false;
  }
};

export const useStaysStore = create<StaysState>((set, get) => ({
  ...load(),
  saveStay: (ownerId, draft, status, id) => {
    const now = new Date().toISOString();
    const existing = id ? get().local.find((s) => s.id === id) : undefined;
    const stay: Stay = existing
      ? { ...existing, ...draft, status, updatedAt: now }
      : { ...draft, id: createId('stay'), ownerId, status, source: 'local', createdAt: now, updatedAt: now };
    const local = existing ? get().local.map((s) => (s.id === stay.id ? stay : s)) : [stay, ...get().local];
    // Only keep what the browser actually stored, so nothing "saved" disappears on reload.
    if (!persist(local)) return { ok: false };
    set({ local, status: 'ready' });
    return { ok: true, stay };
  },
  removeStay: (id) => {
    const local = get().local.filter((s) => s.id !== id);
    if (!persist(local)) return false;
    set({ local });
    return true;
  },
  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ local: [], status: 'ready' });
  },
}));

/** Everything guests can browse: sample listings + listings published in this browser. */
export const useCatalogStays = () => {
  const local = useStaysStore((s) => s.local);
  return useMemo(() => [...local.filter((s) => s.status === 'published'), ...mockStays], [local]);
};

/** A host's own listings created in this browser, drafts included. */
export const useOwnerStays = (ownerId: string) => {
  const local = useStaysStore((s) => s.local);
  return useMemo(() => local.filter((s) => s.ownerId === ownerId), [local, ownerId]);
};

/** Lookup for the detail page; drafts are only visible to their owner. */
export const useStay = (id: string | undefined, viewerId?: string) => {
  const local = useStaysStore((s) => s.local);
  return useMemo(() => {
    const stay = local.find((s) => s.id === id) ?? mockStays.find((s) => s.id === id);
    if (!stay) return undefined;
    return stay.status === 'published' || stay.ownerId === viewerId ? stay : undefined;
  }, [local, id, viewerId]);
};
