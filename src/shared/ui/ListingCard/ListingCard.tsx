import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import { responsiveImage } from '@/shared/lib/images';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import styles from './ListingCard.module.scss';

export interface ListingCardProps {
  /** Id used for favorites. */
  id: string;
  href: string;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
  /** Rating, price… shown under the title. */
  meta?: React.ReactNode;
  /** Catalog cards show "View profile"; the home page variant doesn't. */
  showProfileButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Figma 410×500 card shared by residents (guides) and transport. */
export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  href,
  imageUrl,
  imageAlt = '',
  title,
  subtitle,
  meta,
  showProfileButton = true,
  className,
  ...rest
}) => {
  const { t } = useT();

  return (
    <article className={clsx(styles.card, className)} {...rest}>
      <Link to={href} className={styles.imageWrapper} tabIndex={-1} aria-hidden="true">
        <img
          {...responsiveImage(imageUrl, '(max-width: 520px) 100vw, (max-width: 1280px) 33vw, 25vw')}
          alt={imageAlt}
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div className={styles.titles}>
            <h3 className={styles.name}>
              <Link to={href}>{title}</Link>
            </h3>
            <p className={styles.region}>{subtitle}</p>
          </div>
          <FavoriteButton id={id} variant="inline" />
        </div>

        {meta && <div className={styles.meta}>{meta}</div>}

        {showProfileButton && (
          <Link to={href} className={styles.actionBtn}>
            {t('common.viewProfile')}
          </Link>
        )}
      </div>
    </article>
  );
};
