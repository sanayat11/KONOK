import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.scss';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  className,
}) => {
  return (
    <span className={clsx(styles.badge, styles[variant], styles[size], className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};
