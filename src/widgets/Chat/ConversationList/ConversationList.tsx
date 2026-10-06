import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare, Search } from 'lucide-react';
import { ConversationItem, type Conversation } from '@/entities/chat';
import { Input } from '@/shared/ui/Input';
import { ChatEmptyState } from '../ChatEmptyState';
import styles from './ConversationList.module.scss';

export interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  activeId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUserId,
  activeId,
}) => {
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
    <aside className={styles.panel} aria-label="Список диалогов">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Сообщения</h1>
          {totalUnread > 0 && <span className={styles.counter}>{totalUnread} новых</span>}
        </div>
        {conversations.length > 0 && (
          <Input
            type="search"
            placeholder="Поиск по диалогам"
            aria-label="Поиск по диалогам"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        )}
      </div>

      {conversations.length === 0 ? (
        <ChatEmptyState
          icon={<MessagesSquare size={28} />}
          title="Пока нет сообщений"
          text="Напишите гиду или владельцу автомобиля, чтобы уточнить детали поездки."
          action={
            <Link to="/" className={styles.cta}>
              Найти гида или авто
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <ChatEmptyState icon={<Search size={24} />} title="Ничего не найдено" text="Попробуйте другой запрос." />
      ) : (
        <nav className={styles.list}>
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
    </aside>
  );
};
