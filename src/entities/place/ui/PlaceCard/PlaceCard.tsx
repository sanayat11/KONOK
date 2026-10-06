import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import clsx from 'clsx';
import { Place } from '@/entities/types';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import styles from './PlaceCard.module.scss';

export interface PlaceCardProps {
  place: Place;
}

/** Figma "Места": 550×400 photo card, title bottom-left, heart top-right, arrow bottom-right. */
export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(place.id);

  return (
    <article className={styles.card}>
      <Link to={`/places/${place.id}`} className={styles.link} aria-label={place.name}>
        <img src={place.photoUrl} alt="" className={styles.image} loading="lazy" />
        <span className={styles.overlay} />
        <span className={styles.info}>
          <h3 className={styles.name}>{place.name}</h3>
          <span className={styles.arrow} aria-hidden="true">
            <ArrowRight size={22} strokeWidth={1.8} />
          </span>
        </span>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(place.id)}
        className={clsx(styles.favBtn, favorite && styles.isFav)}
        aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        aria-pressed={favorite}
      >
        <Heart size={30} strokeWidth={1.5} />
      </button>
    </article>
  );
};
