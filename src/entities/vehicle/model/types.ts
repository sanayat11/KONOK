export const VEHICLE_TYPES = ['sedan', 'suv', 'minivan', 'hatchback', 'pickup', 'van', 'misc'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_STATUSES = ['available', 'unavailable', 'maintenance'] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

/** A vehicle a host can offer to guests. Frontend-only: kept in this browser's localStorage. */
export interface HostVehicle {
  id: string;
  ownerId: string;
  /** Downscaled JPEG data URL (so it survives a reload without a server). */
  photo: string;
  makeModel: string;
  year: number;
  type: VehicleType;
  plate: string;
  seats: number;
  description: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export type VehicleDraft = Omit<HostVehicle, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;
