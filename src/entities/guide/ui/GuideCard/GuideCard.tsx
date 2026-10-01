import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Guide } from '@/entities/types';
import { Rating } from '@/shared/ui/Rating';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './GuideCard.module.scss';

export interface GuideCardProps {
  guide: Guide;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(guide.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(guide.id);
  };

  return (
    <div className={styles.card}>
      {/* Image container */}
      <div className={styles.imageWrapper}>
        <img
          src={guide.avatarUrl}
          alt={guide.name}
          className={styles.image}
          loading="lazy"
        />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={clsx(styles.favBtn, favorite && styles.isFav)}
          aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart size={18} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#1E293B'} />
        </button>
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        <h3 className={styles.name}>{guide.name}</h3>
        <p className={styles.region}>{guide.region}</p>

        <div className={styles.ratingRow}>
          <Rating score={guide.rating} count={guide.reviewsCount} size="sm" />
        </div>

        <Link to={`/guides/${guide.id}`} className={styles.actionBtn}>
          Посмотреть профиль
        </Link>
      </div>
    </div>
  );
};
