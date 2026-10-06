import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import styles from './ListingCard.module.scss';

export interface ListingCardProps {
  /** Id used for favorites. */
  id: string;
  href: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  /** Rating, price… shown under the title. */
  meta?: React.ReactNode;
  /** Catalog cards show "Посмотреть профиль"; the home page variant doesn't. */
  showProfileButton?: boolean;
}

/** Figma 410×500 card shared by residents (guides) and transport. */
export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  href,
  imageUrl,
  title,
  subtitle,
  meta,
  showProfileButton = true,
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);

  return (
    <article className={styles.card}>
      <Link to={href} className={styles.imageWrapper} tabIndex={-1} aria-hidden="true">
        <img src={imageUrl} alt="" className={styles.image} loading="lazy" />
      </Link>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div className={styles.titles}>
            <h3 className={styles.name}>
              <Link to={href}>{title}</Link>
            </h3>
            <p className={styles.region}>{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(id)}
            className={clsx(styles.favBtn, favorite && styles.isFav)}
            aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={favorite}
          >
            <Heart size={30} strokeWidth={1.5} />
          </button>
        </div>

        {meta && <div className={styles.meta}>{meta}</div>}

        {showProfileButton && (
          <Link to={href} className={styles.actionBtn}>
            Посмотреть профиль
          </Link>
        )}
      </div>
    </article>
  );
};
