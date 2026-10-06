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
      {showStar && <Star className={styles.starIcon} aria-hidden="true" />}
      {/* Figma format: "4.39 / (38)" — keep the score's own precision, at least one decimal. */}
      <span className={styles.score}>{Number.isInteger(score) ? score.toFixed(1) : String(score)}</span>
      {count !== undefined && <span className={styles.count}>/ ({count})</span>}
    </div>
  );
};
