import React from 'react';
import { Car } from '@/entities/types';
import { useT } from '@/shared/i18n';
import { ListingCard } from '@/shared/ui/ListingCard';

export interface CarCardProps {
  car: Car;
  className?: string;
  style?: React.CSSProperties;
}

export const CarCard: React.FC<CarCardProps> = ({ car, ...rest }) => {
  const { fmt } = useT();
  return (
    <ListingCard
      {...rest}
      id={car.id}
      href={`/cars/${car.id}`}
      imageUrl={car.photoUrl}
      imageAlt={car.name}
      title={car.name}
      subtitle={car.region}
      meta={fmt.pricePerDay(car.pricePerDay)}
    />
  );
};
