import React from 'react';
import clsx from 'clsx';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  text?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Calm empty state with a faint tunduk ring behind the icon. */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, text, action, className }) => (
  <div className={clsx(styles.empty, className)} role="status">
    <span className={styles.icon}>{icon}</span>
    <p className={styles.title}>{title}</p>
    {text && <p className={styles.text}>{text}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
