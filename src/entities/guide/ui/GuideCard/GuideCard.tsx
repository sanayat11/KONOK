import React from 'react';
import { Guide } from '@/entities/types';
import { Rating } from '@/shared/ui/Rating';
import { ListingCard } from '@/shared/ui/ListingCard';

export interface GuideCardProps {
  guide: Guide;
  /** Catalog cards show "View profile"; the home page variant doesn't. */
  showProfileButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, showProfileButton = true, ...rest }) => (
  <ListingCard
    {...rest}
    id={guide.id}
    href={`/guides/${guide.id}`}
    imageUrl={guide.avatarUrl}
    imageAlt={guide.fullName ?? guide.name}
    title={guide.name}
    subtitle={guide.region}
    meta={<Rating score={guide.rating} count={guide.reviewsCount} />}
    showProfileButton={showProfileButton}
  />
);
