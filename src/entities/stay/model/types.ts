import type { RegionId } from '@/entities/types';

export const PROPERTY_TYPES = ['yurt', 'guesthouse', 'house', 'apartment', 'cottage', 'room'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const AMENITIES = [
  'wifi',
  'kitchen',
  'parking',
  'heating',
  'hotWater',
  'breakfast',
  'banya',
  'fireplace',
  'horses',
  'view',
  'kids',
  'laundry',
] as const;
export type Amenity = (typeof AMENITIES)[number];

export const STAY_REGIONS: RegionId[] = ['chuy', 'issyk-kul', 'naryn', 'osh', 'jalal-abad', 'batken', 'talas', 'bishkek'];

export type StayStatus = 'draft' | 'published';

/**
 * An accommodation listing. `basePricePerNight` is what the host asked for; guests always see
 * the price from `stayNightlyPrice()` (shared/lib/pricing), which adds the platform markup.
 */
export interface Stay {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  regionId: RegionId;
  /** Village / town, free text. */
  location: string;
  propertyType: PropertyType;
  basePricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: Amenity[];
  photos: string[];
  status: StayStatus;
  /** `seed` = sample listing shipped with the demo; `local` = created in this browser. */
  source: 'seed' | 'local';
  createdAt: string;
  updatedAt: string;
}

export type StayDraft = Omit<Stay, 'id' | 'ownerId' | 'status' | 'source' | 'createdAt' | 'updatedAt'>;
