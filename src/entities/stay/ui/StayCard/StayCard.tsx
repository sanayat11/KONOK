import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { BedDouble, MapPin, Users } from 'lucide-react';
import { useT } from '@/shared/i18n';
import { responsiveImage } from '@/shared/lib/images';
import { stayNightlyPrice, stayTotalPrice } from '@/shared/lib/pricing';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import type { Stay } from '../../model/types';
import { AMENITY_ICONS } from '../amenityIcons';
import styles from './StayCard.module.scss';

export interface StayCardProps extends React.HTMLAttributes<HTMLElement> {
  stay: Stay;
  /** When the guest picked dates: show the total for that many nights too. */
  nights?: number;
  /** Extra query passed to the detail page (dates, guests). */
  linkQuery?: string;
  /** Owner view: status badge and management buttons. */
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

const MAX_AMENITY_ICONS = 4;

/** Accommodation card: photo, type and place, capacity, key amenities and the final nightly price. */
export const StayCard: React.FC<StayCardProps> = ({ stay, nights, linkQuery, badge, actions, className, ...rest }) => {
  const { t, fmt } = useT();
  const href = `/stays/${stay.id}${linkQuery ? `?${linkQuery}` : ''}`;
  const cover = stay.photos[0];
  const extraAmenities = stay.amenities.length - MAX_AMENITY_ICONS;

  return (
    <article className={clsx(styles.card, className)} {...rest}>
      <Link to={href} className={styles.media} tabIndex={-1} aria-hidden="true">
        {cover ? (
          <img
            {...responsiveImage(cover, '(max-width: 520px) 100vw, (max-width: 1280px) 50vw, 33vw')}
            alt=""
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={styles.noPhoto} />
        )}
        <span className={styles.type}>{t(`stays.types.${stay.propertyType}`)}</span>
      </Link>
      {/* Outside the decorative image link so screen readers announce it. */}
      {(badge || stay.source === 'local') && <span className={styles.demo}>{badge ?? t('stays.demoBadge')}</span>}
      <FavoriteButton id={stay.id} variant="overlay" className={styles.fav} />

      <div className={styles.body}>
        <p className={styles.location}>
          <MapPin size={14} aria-hidden="true" />
          <span>{stay.location || t(`regions.${stay.regionId}.name`)}</span>
        </p>
        <h3 className={styles.title}>
          <Link to={href}>{stay.title}</Link>
        </h3>

        <p className={styles.capacity}>
          <span>
            <Users size={15} aria-hidden="true" />
            {t('stays.upToGuests', { count: stay.maxGuests })}
          </span>
          <span>
            <BedDouble size={15} aria-hidden="true" />
            {t('stays.beds', { count: stay.beds })}
          </span>
        </p>

        {stay.amenities.length > 0 && (
          <ul className={styles.amenities} aria-label={t('stays.amenitiesLabel')}>
            {stay.amenities.slice(0, MAX_AMENITY_ICONS).map((a) => {
              const Icon = AMENITY_ICONS[a];
              return (
                <li key={a} title={t(`stays.amenities.${a}`)}>
                  <Icon size={15} strokeWidth={1.8} />
                  <span>{t(`stays.amenities.${a}`)}</span>
                </li>
              );
            })}
            {extraAmenities > 0 && <li className={styles.more}>+{extraAmenities}</li>}
          </ul>
        )}

        <div className={styles.footer}>
          <p className={styles.price}>
            <strong>{fmt.price(stayNightlyPrice(stay.basePricePerNight))}</strong>
            <span>{t('stays.perNight')}</span>
          </p>
          {nights && nights > 0 ? (
            <p className={styles.total}>{t('stays.totalFor', { total: fmt.price(stayTotalPrice(stay.basePricePerNight, nights)), nights: t('booking.nights', { count: nights }) })}</p>
          ) : (
            <p className={styles.isNew}>{t('stays.newListing')}</p>
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </article>
  );
};
