import React from 'react';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import styles from '../AuthPage.module.scss';

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Host flow: 1–4 progress circles under the title. */
  step?: number;
  wide?: boolean;
  children: React.ReactNode;
}

const STEPS = [1, 2, 3, 4];

/** White Figma form card: "← Назад", bold title, small caption, optional 1–4 stepper. */
export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, onBack, step, wide, children }) => (
  <div className={clsx(styles.card, wide && styles.cardWide)}>
    {onBack && (
      <button type="button" className={styles.back} onClick={onBack}>
        <ArrowLeft size={26} strokeWidth={1.5} /> Назад
      </button>
    )}
    <h1 className={styles.cardTitle}>{title}</h1>
    {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
    {step && (
      <ol className={styles.stepper} aria-label={`Шаг ${step} из 4`}>
        {STEPS.map((n) => (
          <li key={n} className={clsx(styles.stepDot, n <= step && styles.stepDone)} aria-current={n === step ? 'step' : undefined}>
            {n}
          </li>
        ))}
      </ol>
    )}
    {children}
  </div>
);
