import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Place } from '@/entities/types';
import { responsiveImage } from '@/shared/lib/images';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import styles from './PlaceCard.module.scss';

export interface PlaceCardProps {
  place: Place;
  className?: string;
  style?: React.CSSProperties;
}

/** Figma "Места": 550×400 photo card, title bottom-left, heart top-right, arrow bottom-right. */
export const PlaceCard: React.FC<PlaceCardProps> = ({ place, className, style }) => (
  <article className={clsx(styles.card, className)} style={style}>
    <Link to={`/places/${place.id}`} className={styles.link} aria-label={place.name}>
      <img
        {...responsiveImage(place.photoUrl, '(max-width: 560px) 100vw, (max-width: 960px) 50vw, 33vw')}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
      <span className={styles.overlay} />
      <span className={styles.info}>
        <h3 className={styles.name}>{place.name}</h3>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowRight size={20} strokeWidth={1.8} />
        </span>
      </span>
    </Link>

    <FavoriteButton id={place.id} variant="overlay" className={styles.favBtn} />
  </article>
);
