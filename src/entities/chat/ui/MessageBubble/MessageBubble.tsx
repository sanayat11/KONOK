import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import type { ChatMessage } from '../../model/types';
import { formatMessageTime } from '../../lib/format';
import styles from './MessageBubble.module.scss';

export interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  /** First bubble of a run from the same sender — gets the pointed corner. */
  isFirstInGroup?: boolean;
  /** Arrived while the thread was open — animates in. */
  isNew?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, isFirstInGroup = false, isNew = false }) => {
  const { t } = useT();
  return (
    <div
      className={clsx(
        styles.bubble,
        isOwn ? styles.own : styles.incoming,
        isFirstInGroup && styles.first,
        isNew && styles.new,
      )}
    >
      <p className={styles.text}>{message.text}</p>
      <span className={styles.meta}>
        <time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
        {isOwn &&
          (message.readAt ? (
            <CheckCheck size={13} aria-label={t('chat.read')} className={styles.read} />
          ) : (
            <Check size={13} aria-label={t('chat.sent')} />
          ))}
      </span>
    </div>
  );
};
