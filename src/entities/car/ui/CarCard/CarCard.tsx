import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Car } from '@/entities/types';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './CarCard.module.scss';

export interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(car.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={car.photoUrl}
          alt={car.name}
          className={styles.image}
          loading="lazy"
        />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={clsx(styles.favBtn, favorite && styles.isFav)}
          aria-label={favorite ? 'Удалить из сохраненных' : 'Сохранить'}
        >
          <Heart size={18} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#1E293B'} />
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{car.name}</h3>
        <p className={styles.region}>{car.region}</p>
        <p className={styles.price}>
          <strong>{car.pricePerDay.toLocaleString()} сом</strong> / день
        </p>

        <Link to={`/cars/${car.id}`} className={styles.actionBtn}>
          Посмотреть профиль
        </Link>
      </div>
    </div>
  );
};
