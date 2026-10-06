import React from 'react';
import styles from './ChatEmptyState.module.scss';

export interface ChatEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  text?: string;
  action?: React.ReactNode;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ icon, title, text, action }) => (
  <div className={styles.empty}>
    <span className={styles.icon}>{icon}</span>
    <h3 className={styles.title}>{title}</h3>
    {text && <p className={styles.text}>{text}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
