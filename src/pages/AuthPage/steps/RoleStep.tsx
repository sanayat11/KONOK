import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/shared/i18n';
import { IMAGES, responsiveImage } from '@/shared/lib/images';
import styles from '../AuthPage.module.scss';

const ROLES = [
  { id: 'tourist', image: IMAGES.roleTourist },
  { id: 'host', image: IMAGES.roleHost },
] as const;

interface RoleStepProps {
  onSelect: (role: 'tourist' | 'host') => void;
}

/** Figma "Регистрация": two 400×600 role cards. */
export const RoleStep: React.FC<RoleStepProps> = ({ onSelect }) => {
  const { t } = useT();
  return (
    <div className={styles.roles}>
      {ROLES.map(({ id, image }, index) => (
        <article key={id} className={styles.roleCard} style={{ animationDelay: `${120 + index * 120}ms` }}>
          <div className={styles.roleMedia}>
            <img
              {...responsiveImage(image, '(max-width: 768px) 100vw, 400px')}
              alt={t(`auth.roles.${id}.alt`)}
              className={styles.roleImage}
              onError={(e) => {
                // The tinted placeholder behind the photo stays as a graceful fallback.
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
          </div>
          <div className={styles.roleBody}>
            <h2 className={styles.roleTitle}>{t(`auth.roles.${id}.title`)}</h2>
            <p className={styles.roleText}>{t(`auth.roles.${id}.text`)}</p>
            <button type="button" className={styles.roleBtn} onClick={() => onSelect(id)}>
              {t('auth.choose')} <ArrowRight size={20} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};
