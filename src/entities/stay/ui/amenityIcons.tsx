import React from 'react';
import {
  Baby,
  Bath,
  CookingPot,
  Coffee,
  Flame,
  Mountain,
  ParkingSquare,
  ShowerHead,
  ThermometerSun,
  WashingMachine,
  Wifi,
} from 'lucide-react';
import { HorseIcon } from '@/shared/ui/HorseIcon';
import type { Amenity } from '../model/types';

type IconProps = { size?: number; strokeWidth?: number; className?: string };

export const AMENITY_ICONS: Record<Amenity, React.ComponentType<IconProps>> = {
  wifi: Wifi,
  kitchen: CookingPot,
  parking: ParkingSquare,
  heating: ThermometerSun,
  hotWater: ShowerHead,
  breakfast: Coffee,
  banya: Bath,
  fireplace: Flame,
  horses: HorseIcon,
  view: Mountain,
  kids: Baby,
  laundry: WashingMachine,
};
