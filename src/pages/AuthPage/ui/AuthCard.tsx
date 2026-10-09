import React from 'react';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import styles from '../AuthPage.module.scss';

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Host flow: numbered circles under the title (Figma). */
  step?: { current: number; total: number };
  wide?: boolean;
  children: React.ReactNode;
}

/** White Figma form card: "← Back", bold centred title, small caption, optional 1–4 stepper. */
export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, onBack, step, wide, children }) => {
  const { t } = useT();
  return (
    <div className={clsx(styles.card, wide && styles.cardWide)}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.6} /> {t('common.back')}
        </button>
      )}
      <h1 className={styles.cardTitle}>{title}</h1>
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      {step && (
        <ol className={styles.stepper} aria-label={t('auth.stepOf', { step: step.current, total: step.total })}>
          {Array.from({ length: step.total }, (_, i) => i + 1).map((n) => (
            <li
              key={n}
              className={clsx(styles.stepDot, n < step.current && styles.stepDone, n === step.current && styles.stepCurrent)}
              aria-current={n === step.current ? 'step' : undefined}
            >
              {n}
            </li>
          ))}
        </ol>
      )}
      {children}
    </div>
  );
};
