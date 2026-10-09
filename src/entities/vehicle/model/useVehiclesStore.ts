import { create } from 'zustand';
import { createId } from '@/shared/lib/date';
import type { HostVehicle, VehicleDraft } from './types';

const STORAGE_KEY = 'konok_host_vehicles';

type VehiclesByOwner = Record<string, HostVehicle[]>;

/** `error` means the saved data could not be read (corrupted or blocked storage). */
type LoadStatus = 'ready' | 'error';

export type SaveResult = { ok: true; vehicle: HostVehicle } | { ok: false };

interface VehiclesState {
  byOwner: VehiclesByOwner;
  status: LoadStatus;
  /** Creates the vehicle, or updates it when `id` is given. Fails if the browser refuses to store it. */
  saveVehicle: (ownerId: string, draft: VehicleDraft, id?: string) => SaveResult;
  removeVehicle: (ownerId: string, id: string) => boolean;
  /** Recovery from a load error: drops the unreadable data. */
  reset: () => void;
}

const load = (): { byOwner: VehiclesByOwner; status: LoadStatus } => {
  if (typeof window === 'undefined') return { byOwner: {}, status: 'ready' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { byOwner: {}, status: 'ready' };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
    return { byOwner: parsed as VehiclesByOwner, status: 'ready' };
  } catch {
    return { byOwner: {}, status: 'error' };
  }
};

/** Returns false when the write was refused (quota exceeded, private mode…). */
const persist = (byOwner: VehiclesByOwner) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byOwner));
    return true;
  } catch {
    return false;
  }
};

export const useVehiclesStore = create<VehiclesState>((set, get) => ({
  ...load(),
  saveVehicle: (ownerId, draft, id) => {
    const now = new Date().toISOString();
    const list = get().byOwner[ownerId] ?? [];
    const existing = id ? list.find((v) => v.id === id) : undefined;
    const vehicle: HostVehicle = existing
      ? { ...existing, ...draft, updatedAt: now }
      : { ...draft, id: createId('vehicle'), ownerId, createdAt: now, updatedAt: now };
    const nextList = existing ? list.map((v) => (v.id === vehicle.id ? vehicle : v)) : [vehicle, ...list];
    const byOwner = { ...get().byOwner, [ownerId]: nextList };
    // Only reflect what was actually stored, so the list never claims a save that will vanish on reload.
    if (!persist(byOwner)) return { ok: false };
    set({ byOwner, status: 'ready' });
    return { ok: true, vehicle };
  },
  removeVehicle: (ownerId, id) => {
    const list = get().byOwner[ownerId] ?? [];
    const byOwner = { ...get().byOwner, [ownerId]: list.filter((v) => v.id !== id) };
    if (!persist(byOwner)) return false;
    set({ byOwner });
    return true;
  },
  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ byOwner: {}, status: 'ready' });
  },
}));

const EMPTY: HostVehicle[] = [];

/** The signed-in host's vehicles, newest first. */
export const useOwnerVehicles = (ownerId: string) => useVehiclesStore((s) => s.byOwner[ownerId] ?? EMPTY);
