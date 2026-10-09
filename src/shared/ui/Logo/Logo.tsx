import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import styles from './Logo.module.scss';

/** Tunduk (yurt crown) ornament that replaces the "О" in the KONOK wordmark. */
const Tunduk: React.FC = () => (
  <svg className={styles.mark} viewBox="0 0 50 50" aria-hidden="true">
    <circle cx="25" cy="25" r="23.5" className={styles.disc} />
    <g className={styles.lines}>
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="2.2" />
      <circle cx="25" cy="25" r="9.5" fill="none" strokeWidth="2" />
      <g strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M16.5 8.5 Q25 18 33.5 8.5" />
        <path d="M16.5 41.5 Q25 32 33.5 41.5" />
        <path d="M8.5 16.5 Q18 25 8.5 33.5" />
        <path d="M41.5 16.5 Q32 25 41.5 33.5" />
      </g>
    </g>
    <g className={styles.dots}>
      <circle cx="25" cy="25" r="3" />
      <circle cx="25" cy="10.5" r="1.6" />
      <circle cx="25" cy="39.5" r="1.6" />
      <circle cx="10.5" cy="25" r="1.6" />
      <circle cx="39.5" cy="25" r="1.6" />
    </g>
  </svg>
);

export interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  const { t } = useT();
  return (
    <Link to="/" className={clsx(styles.logo, className)} aria-label={t('nav.logoHome')}>
      <span aria-hidden="true">К</span>
      <Tunduk />
      <span aria-hidden="true">НОК</span>
    </Link>
  );
};
