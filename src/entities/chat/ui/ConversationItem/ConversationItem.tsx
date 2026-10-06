import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import type { Conversation } from '../../model/types';
import { formatConversationTime } from '../../lib/format';
import styles from './ConversationItem.module.scss';

export interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  isActive = false,
}) => {
  const { participant, listing, lastMessage, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;
  const isOwnLast = lastMessage?.senderId === currentUserId;

  return (
    <Link
      to={`/messages/${conversation.id}`}
      className={clsx(styles.item, isActive && styles.active, hasUnread && styles.unread)}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={styles.media}>
        <img src={listing.photoUrl} alt="" className={styles.listingImage} loading="lazy" />
        <img src={participant.avatarUrl} alt={participant.name} className={styles.avatar} loading="lazy" />
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.name}>{participant.name}</span>
          <time className={styles.time} dateTime={conversation.updatedAt}>
            {formatConversationTime(lastMessage?.createdAt ?? conversation.updatedAt)}
          </time>
        </div>
        <span className={styles.listing}>{listing.title}</span>
        <div className={styles.bottomRow}>
          <span className={styles.preview}>
            {lastMessage ? (
              <>
                {isOwnLast && <span className={styles.you}>Вы: </span>}
                {lastMessage.text}
              </>
            ) : (
              <span className={styles.draft}>Начните диалог</span>
            )}
          </span>
          {hasUnread && (
            <span className={styles.badge} aria-label={`Непрочитанных: ${unreadCount}`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
