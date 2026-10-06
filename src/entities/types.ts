// Entity Types for KONOK Kyrgyzstan Platform

export type RegionId = 'bishkek' | 'issyk-kul' | 'naryn' | 'osh' | 'jalal-abad' | 'batken' | 'talas' | 'chuy';

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface Guide {
  id: string;
  name: string;
  fullName?: string;
  region: string;
  regionId: RegionId;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerDay: number;
  /** How many guests the resident can host at once. */
  maxGuests?: number;
  avatarUrl: string;
  gallery: string[];
  roleTitle: string;
  bio: string;
  languages: string[];
  services: string[];
  phone?: string;
  whatsapp?: string;
  isSuperhost?: boolean;
  reviews: Review[];
}

export interface Place {
  id: string;
  name: string;
  region: string;
  regionId: RegionId;
  category: string;
  shortDesc: string;
  description: string;
  photoUrl: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  coordinates: {
    lat: number;
    lng: number;
    topPercent: number; // For interactive visual map
    leftPercent: number;
  };
  highlights: string[];
  localHostIds: string[];
}

export interface Car {
  id: string;
  name: string;
  type: string;
  region: string;
  regionId: RegionId;
  pricePerDay: number;
  photoUrl: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  specs: {
    seats: number;
    transmission: string;
    drive: string;
    ac: boolean;
    fuel: string;
    year: number;
  };
  description: string;
  included: string[];
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    responseTime: string;
  };
  reviews: Review[];
}

export interface BookingItem {
  id: string;
  title: string;
  category: 'guide' | 'car' | 'place' | 'hotel';
  dateRange: string;
  location: string;
  price: number;
  photoUrl: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface ItineraryWaypoint {
  id: string;
  dayNumber: number;
  title: string;
  subtitle: string;
  dates: string;
  photoUrl: string;
  lat: number;
  lng: number;
  category: string;
  price: number;
}

export interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  role: 'tourist' | 'host' | 'guide';
  daysTravelled: number;
  tripsCount: number;
  memberSince: string;
  languages: Array<{ name: string; level: string }>;
  visitedRegions: Array<{ name: string; photoUrl: string }>;
  country?: string;
  birthDate?: string;
  interests?: string[];
}
