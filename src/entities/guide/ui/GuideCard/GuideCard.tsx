import React from 'react';
import { Guide } from '@/entities/types';
import { Rating } from '@/shared/ui/Rating';
import { ListingCard } from '@/shared/ui/ListingCard';

export interface GuideCardProps {
  guide: Guide;
  /** Catalog cards show "Посмотреть профиль"; the home page variant doesn't. */
  showProfileButton?: boolean;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, showProfileButton = true }) => (
  <ListingCard
    id={guide.id}
    href={`/guides/${guide.id}`}
    imageUrl={guide.avatarUrl}
    title={guide.name}
    subtitle={guide.region}
    meta={<Rating score={guide.rating} count={guide.reviewsCount} />}
    showProfileButton={showProfileButton}
  />
);
