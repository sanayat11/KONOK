import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link to="/" className={styles.footerLink}>
            Контакты
          </Link>
          <Link to="/" className={styles.footerLink}>
            О нас
          </Link>
          <Link to="/" className={styles.footerLink}>
            Юридическая информация
          </Link>
        </div>
        <div className={styles.copyright}>
          © 2026 KONOK — Платформа бронирования аутентичных путешествий и сервисов Кыргызстана. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
