import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircleMore } from 'lucide-react';
import {
  groupMessages,
  LISTING_TYPE_LABEL,
  MessageBubble,
  type ChatMessage,
  type Conversation,
} from '@/entities/chat';
import { MessageComposer } from '../MessageComposer';
import { ChatEmptyState } from '../ChatEmptyState';
import styles from './ChatWindow.module.scss';

const QUICK_REPLIES: Record<Conversation['role'], string[]> = {
  tourist: [
    'Здравствуйте! Свободны ли вы на мои даты?',
    'Какая итоговая стоимость?',
    'Можно ли договориться о встрече в аэропорту?',
  ],
  owner: ['Здравствуйте! Да, даты свободны.', 'Спасибо за интерес! Уточните, пожалуйста, даты.'],
};

export interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, messages, currentUserId, onSend }) => {
  const { participant, listing, role } = conversation;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const days = useMemo(() => groupMessages(messages), [messages]);

  // Stick to the newest message when the thread opens or grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.id, messages.length]);

  return (
    <section className={styles.window} aria-label={`Диалог с ${participant.name}`}>
      <header className={styles.header}>
        <Link to="/messages" className={styles.back} aria-label="Назад к диалогам">
          <ArrowLeft size={20} />
        </Link>
        <img src={participant.avatarUrl} alt="" className={styles.avatar} />
        <div className={styles.headerText}>
          <h2 className={styles.name}>{participant.name}</h2>
          <span className={styles.role}>{role === 'tourist' ? 'Хозяин' : 'Гость'}</span>
        </div>
      </header>

      <div className={styles.listingBar}>
        <img src={listing.photoUrl} alt="" className={styles.listingImage} />
        <div className={styles.listingText}>
          <span className={styles.listingType}>{LISTING_TYPE_LABEL[listing.type]}</span>
          <span className={styles.listingTitle}>{listing.title}</span>
        </div>
      </div>

      <div className={styles.messages} ref={scrollRef} role="log" aria-live="polite">
        {messages.length === 0 ? (
          <ChatEmptyState
            icon={<MessageCircleMore size={28} />}
            title="Начните диалог"
            text={
              role === 'tourist'
                ? `Задайте вопрос — ${participant.name} обычно отвечает в течение часа.`
                : 'Ответьте туристу, чтобы договориться о деталях.'
            }
            action={
              <div className={styles.quickReplies}>
                {QUICK_REPLIES[role].map((text) => (
                  <button key={text} type="button" className={styles.quickReply} onClick={() => {
                      setDraft(text);
                      inputRef.current?.focus();
                    }}>
                    {text}
                  </button>
                ))}
              </div>
            }
          />
        ) : (
          days.map((day) => (
            <div key={day.key} className={styles.day}>
              <div className={styles.dayLabel}>
                <span>{day.label}</span>
              </div>
              {day.groups.map((group) => {
                const isOwn = group.senderId === currentUserId;
                return (
                  <div key={group.key} className={isOwn ? styles.groupOwn : styles.group}>
                    {!isOwn && <img src={participant.avatarUrl} alt="" className={styles.groupAvatar} />}
                    <div className={styles.groupBubbles}>
                      {group.messages.map((message, index) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={isOwn}
                          isFirstInGroup={index === 0}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <MessageComposer value={draft} onChange={setDraft} onSend={onSend} inputRef={inputRef} />
    </section>
  );
};
