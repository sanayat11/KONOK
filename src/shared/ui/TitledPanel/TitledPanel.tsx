import React from 'react';
import clsx from 'clsx';
import styles from './TitledPanel.module.scss';

export interface TitledPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** White Figma panel with a small underlined tab-like title ("Отзывы", "Видео и фотографии"). */
export const TitledPanel: React.FC<TitledPanelProps> = ({ title, children, className }) => (
  <section className={clsx(styles.panel, className)}>
    <h2 className={styles.title}>{title}</h2>
    {children}
  </section>
);
