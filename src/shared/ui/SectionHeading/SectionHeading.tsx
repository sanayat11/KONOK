import React from 'react';
import clsx from 'clsx';
import styles from './SectionHeading.module.scss';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
  className?: string;
}

/** Figma section title: 40px bold heading with a small caption underneath. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, as: Tag = 'h2', className }) => (
  <div className={clsx(styles.heading, className)}>
    <Tag className={styles.title}>{title}</Tag>
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </div>
);
