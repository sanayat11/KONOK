import React from 'react';
import clsx from 'clsx';
import styles from './SectionHeading.module.scss';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Right-aligned slot (e.g. "View all" link). */
  action?: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  className?: string;
}

/** Editorial section title: serif display heading with an optional eyebrow and caption. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  eyebrow,
  action,
  as: Tag = 'h2',
  align = 'left',
  className,
}) => (
  <div className={clsx(styles.heading, align === 'center' && styles.center, className)}>
    <div className={styles.text}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Tag className={styles.title}>{title}</Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
