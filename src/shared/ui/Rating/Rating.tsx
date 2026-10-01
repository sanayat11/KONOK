import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import styles from './Rating.module.scss';

export interface RatingProps {
  score: number;
  count?: number;
  showStar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  score,
  count,
  showStar = true,
  size = 'md',
  className,
}) => {
  return (
    <div className={clsx(styles.ratingContainer, styles[size], className)}>
      {showStar && <Star className={styles.starIcon} size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span className={styles.score}>{score.toFixed(1)}</span>
      {count !== undefined && <span className={styles.count}>({count})</span>}
    </div>
  );
};
