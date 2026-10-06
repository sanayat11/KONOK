import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from '../AuthPage.module.scss';

const ROLE_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80';

const ROLES = [
  { id: 'tourist', title: 'Я конок (гость)', text: 'Ищу местных жителей, места и транспорт для путешествий по Кыргызстану.' },
  { id: 'host', title: 'Я хозяин', text: 'Принимаю гостей. Сдаю жилье, предлагаю услуги и транспорт' },
] as const;

interface RoleStepProps {
  onSelect: (role: 'tourist' | 'host') => void;
}

/** Figma "Регистрация": two 400×600 role cards. */
export const RoleStep: React.FC<RoleStepProps> = ({ onSelect }) => (
  <div className={styles.roles}>
    {ROLES.map((role) => (
      <article key={role.id} className={styles.roleCard}>
        <img src={ROLE_IMAGE} alt="" className={styles.roleImage} />
        <div className={styles.roleBody}>
          <h2 className={styles.roleTitle}>{role.title}</h2>
          <p className={styles.roleText}>{role.text}</p>
          <button type="button" className={styles.roleBtn} onClick={() => onSelect(role.id)}>
            Выбрать <ArrowRight size={22} />
          </button>
        </div>
      </article>
    ))}
  </div>
);
