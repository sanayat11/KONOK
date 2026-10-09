import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/shared/i18n';
import styles from './Footer.module.scss';

/** Figma: brand-colored band with info links; a thin ornament border on top. */
export const Footer: React.FC = () => {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.ornament} aria-hidden="true" />
      <div className={styles.container}>
        <nav className={styles.links} aria-label={t('footer.company')}>
          <Link to="/" className={styles.footerLink}>
            {t('footer.contacts')}
          </Link>
          <Link to="/" className={styles.footerLink}>
            {t('footer.about')}
          </Link>
          <Link to="/" className={styles.footerLink}>
            {t('footer.legal')}
          </Link>
        </nav>
        <p className={styles.copyright}>
          {t('footer.copyright', { year })} ·{' '}
          <a href="/images/CREDITS.md" target="_blank" rel="noreferrer">
            {t('footer.photoCredits')}
          </a>
        </p>
      </div>
    </footer>
  );
};
