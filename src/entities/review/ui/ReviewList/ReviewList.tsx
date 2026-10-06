import React from 'react';
import { Review } from '@/entities/types';
import styles from './ReviewList.module.scss';

export interface ReviewListProps {
  reviews: Review[];
}

/** Figma review rows: 70px round avatar, 20px text, thin divider between rows. */
export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) =>
  reviews.length === 0 ? (
    <p className={styles.empty}>Отзывов пока нет — станьте первым гостем!</p>
  ) : (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <li key={review.id} className={styles.item}>
          <img src={review.authorAvatar} alt={review.authorName} className={styles.avatar} loading="lazy" />
          <p className={styles.text}>{review.text}</p>
        </li>
      ))}
    </ul>
  );
