import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/entities/types';
import { useT } from '@/shared/i18n';
import styles from './ReviewList.module.scss';

export interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const { t, fmt } = useT();

  if (reviews.length === 0) {
    return <p className={styles.empty}>{t('reviews.empty')}</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <li key={review.id} className={styles.item}>
          <img src={review.authorAvatar} alt="" className={styles.avatar} loading="lazy" />
          <div className={styles.body}>
            <div className={styles.head}>
              <span className={styles.author}>{review.authorName}</span>
              <span className={styles.rating} aria-label={t('rating.label', { score: fmt.rating(review.rating) })}>
                <Star size={12} aria-hidden="true" /> {fmt.rating(review.rating)}
              </span>
              {review.date && <span className={styles.date}>{review.date}</span>}
            </div>
            <p className={styles.text}>{review.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
