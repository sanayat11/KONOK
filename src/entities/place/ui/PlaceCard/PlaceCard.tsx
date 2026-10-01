import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Place } from '@/entities/types';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './PlaceCard.module.scss';

export interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(place.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(place.id);
  };

  return (
    <Link to={`/places/${place.id}`} className={styles.card}>
      <img
        src={place.photoUrl}
        alt={place.name}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.gradientOverlay} />

      {/* Top action: favorite */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        className={clsx(styles.favBtn, favorite && styles.isFav)}
        aria-label={favorite ? 'Удалить из сохраненных' : 'Сохранить'}
      >
        <Heart size={16} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#fff'} />
      </button>

      {/* Card bottom info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{place.name}</h3>
        <p className={styles.category}>
          <MapPin size={13} className={styles.pinIcon} />
          <span>{place.region}</span>
        </p>
      </div>
    </Link>
  );
};
