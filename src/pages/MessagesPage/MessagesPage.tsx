import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Lock, MessagesSquare, SearchX } from 'lucide-react';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useChatStore, useConversations, useThreadMessages } from '@/entities/chat';
import { ChatWindow, ConversationList } from '@/widgets/Chat';
import { ChatEmptyState } from '@/widgets/Chat/ChatEmptyState';
import styles from './MessagesPage.module.scss';

export const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const user = useAuthStore((s) => s.user);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markAsRead = useChatStore((s) => s.markAsRead);

  const conversations = useConversations(user?.id);
  // Only threads the current user belongs to can be opened.
  const active = conversations.find((c) => c.id === conversationId);
  const messages = useThreadMessages(active?.id);

  // Opening a thread reads it — but not on the render where the account itself
  // switched, since the old thread URL is still showing at that moment.
  const lastUserId = useRef(user?.id);
  useEffect(() => {
    const accountSwitched = lastUserId.current !== user?.id;
    lastUserId.current = user?.id;
    if (accountSwitched) return;
    if (active && user && active.unreadCount > 0) markAsRead(active.id, user.id);
  }, [active, user, markAsRead]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={clsx(styles.shell, styles.single)}>
          <ChatEmptyState
            icon={<Lock size={26} />}
            title="Войдите, чтобы открыть сообщения"
            text="Переписка с гидами и владельцами доступна только авторизованным пользователям."
            action={
              <Link to="/auth?mode=login" className={styles.cta}>
                Войти
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div
        className={clsx(
          styles.shell,
          conversationId && styles.threadOpen,
          conversations.length === 0 && !conversationId && styles.noThreads,
        )}
      >
        <div className={styles.listPane}>
          <ConversationList conversations={conversations} currentUserId={user.id} activeId={active?.id} />
        </div>

        <div className={styles.chatPane}>
          {active ? (
            <ChatWindow
              key={active.id}
              conversation={active}
              messages={messages}
              currentUserId={user.id}
              onSend={(text) => sendMessage(active.id, user.id, text)}
            />
          ) : conversationId ? (
            <ChatEmptyState
              icon={<SearchX size={26} />}
              title="Диалог не найден"
              text="Возможно, он был удалён или принадлежит другому пользователю."
              action={
                <Link to="/messages" className={styles.cta}>
                  К списку диалогов
                </Link>
              }
            />
          ) : (
            <ChatEmptyState
              icon={<MessagesSquare size={28} />}
              title="Выберите диалог"
              text="Откройте переписку слева, чтобы продолжить общение."
            />
          )}
        </div>
      </div>
    </div>
  );
};
