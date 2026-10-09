import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import styles from './Rating.module.scss';

export interface RatingProps {
  score: number;
  count?: number;
  showStar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({ score, count, showStar = true, size = 'md', className }) => {
  const { t, fmt } = useT();
  const label =
    count !== undefined
      ? t('rating.labelWithCount', { score: fmt.rating(score), count })
      : t('rating.label', { score: fmt.rating(score) });

  return (
    <span className={clsx(styles.ratingContainer, styles[size], className)} aria-label={label} role="img">
      {showStar && <Star className={styles.starIcon} aria-hidden="true" />}
      <span className={styles.score} aria-hidden="true">
        {fmt.rating(score)}
      </span>
      {count !== undefined && (
        <span className={styles.count} aria-hidden="true">
          / ({count})
        </span>
      )}
    </span>
  );
};
