import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare, Search } from 'lucide-react';
import { ConversationItem, type Conversation } from '@/entities/chat';
import { useT } from '@/shared/i18n';
import { Input } from '@/shared/ui/Input';
import { ChatEmptyState } from '../ChatEmptyState';
import styles from './ConversationList.module.scss';

export interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  activeId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, currentUserId, activeId }) => {
  const { t } = useT();
  const [query, setQuery] = useState('');
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.participant.name.toLowerCase().includes(q) ||
        c.listing.title.toLowerCase().includes(q) ||
        c.lastMessage?.text.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <aside className={styles.panel} aria-label={t('chat.listLabel')}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t('chat.title')}</h1>
          {totalUnread > 0 && <span className={styles.counter}>{t('chat.newCount', { count: totalUnread })}</span>}
        </div>
        {conversations.length > 0 && (
          <Input
            type="search"
            placeholder={t('chat.searchPlaceholder')}
            aria-label={t('chat.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search size={15} />}
          />
        )}
      </div>

      {conversations.length === 0 ? (
        <ChatEmptyState
          icon={<MessagesSquare size={24} />}
          title={t('chat.emptyTitle')}
          text={t('chat.emptyText')}
          action={
            <Link to="/catalog/guides" className={styles.cta}>
              {t('chat.emptyCta')}
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <ChatEmptyState icon={<Search size={22} />} title={t('chat.noResultsTitle')} text={t('chat.noResultsText')} />
      ) : (
        <nav className={styles.list} aria-label={t('chat.listLabel')}>
          {filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={currentUserId}
              isActive={conversation.id === activeId}
            />
          ))}
        </nav>
      )}

      <p className={styles.footnote}>{t('chat.syncNote')}</p>
    </aside>
  );
};
