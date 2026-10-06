import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <nav className={styles.links} aria-label="Информация">
        <Link to="/" className={styles.footerLink}>
          Контакты
        </Link>
        <Link to="/" className={styles.footerLink}>
          О нас
        </Link>
        <Link to="/" className={styles.footerLink}>
          Юридическая информация
        </Link>
      </nav>
      <p className={styles.copyright}>© 2026 КОНОК — путешествия по Кыргызстану с местными жителями.</p>
    </div>
  </footer>
);
