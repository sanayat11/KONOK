import React from 'react';
import { Car } from '@/entities/types';
import { ListingCard } from '@/shared/ui/ListingCard';

export interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => (
  <ListingCard
    id={car.id}
    href={`/cars/${car.id}`}
    imageUrl={car.photoUrl}
    title={car.name}
    subtitle={car.region}
    meta={`${car.pricePerDay} сом / день`}
  />
);
