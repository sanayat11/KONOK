import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MessageCircleMore } from 'lucide-react';
import { groupMessages, MessageBubble, type ChatMessage, type Conversation } from '@/entities/chat';
import { useT, type TranslationKey } from '@/shared/i18n';
import { Avatar } from '@/shared/ui/Avatar';
import { MessageComposer } from '../MessageComposer';
import { ChatEmptyState } from '../ChatEmptyState';
import styles from './ChatWindow.module.scss';

const QUICK_REPLIES: Record<Conversation['role'], TranslationKey[]> = {
  tourist: ['chat.quickReplies.tourist1', 'chat.quickReplies.tourist2', 'chat.quickReplies.tourist3'],
  owner: ['chat.quickReplies.owner1', 'chat.quickReplies.owner2'],
};

const LISTING_PATH = { car: '/cars', guide: '/guides' } as const;

export interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (text: string) => void;
}

/** One open thread. Keyed by conversation id, so state resets when switching threads. */
export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, messages, currentUserId, onSend }) => {
  const { t, locale } = useT();
  const { participant, listing, role } = conversation;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  // Messages present when the thread opened don't animate; new ones do.
  const initialIds = useRef(new Set(messages.map((m) => m.id)));
  const lastCount = useRef(messages.length);
  // `locale` is a dependency because day labels ("Today", "5 October") are localized.
  const days = useMemo(() => groupMessages(messages), [messages, locale]);

  // Open at the newest message.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Follow new messages when the reader is near the bottom (or just sent one).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length <= lastCount.current) {
      lastCount.current = messages.length;
      return;
    }
    lastCount.current = messages.length;
    const own = messages[messages.length - 1]?.senderId === currentUserId;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (own || nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, currentUserId]);

  return (
    <section className={styles.window} aria-label={t('chat.dialogWith', { name: participant.name })}>
      <header className={styles.header}>
        <Link to="/messages" className={styles.back} aria-label={t('chat.backToList')}>
          <ArrowLeft size={18} />
        </Link>
        <Avatar src={participant.avatarUrl} name={participant.name} size={38} />
        <div className={styles.headerText}>
          <h2 className={styles.name}>{participant.name}</h2>
          <span className={styles.role}>{role === 'tourist' ? t('chat.roleHost') : t('chat.roleGuest')}</span>
        </div>

        <Link to={`${LISTING_PATH[listing.type]}/${listing.id}`} className={styles.listing} title={t('chat.openListing')}>
          <img src={listing.photoUrl} alt="" className={styles.listingImage} />
          <span className={styles.listingText}>
            <span className={styles.listingType}>{t(`chat.listingType.${listing.type}`)}</span>
            <span className={styles.listingTitle}>{listing.title}</span>
          </span>
          <ArrowUpRight size={14} className={styles.listingArrow} />
        </Link>
      </header>

      <div className={styles.messages} ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions">
        {messages.length === 0 ? (
          <ChatEmptyState
            icon={<MessageCircleMore size={24} />}
            title={t('chat.startConversation')}
            text={
              role === 'tourist'
                ? t('chat.emptyThreadTouristText', { name: participant.name })
                : t('chat.emptyThreadOwnerText')
            }
            action={
              <div className={styles.quickReplies}>
                {QUICK_REPLIES[role].map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={styles.quickReply}
                    onClick={() => {
                      setDraft(t(key));
                      inputRef.current?.focus();
                    }}
                  >
                    {t(key)}
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
                    {!isOwn && <Avatar src={participant.avatarUrl} name={participant.name} size={28} className={styles.groupAvatar} />}
                    <div className={styles.groupBubbles}>
                      {group.messages.map((message, index) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={isOwn}
                          isFirstInGroup={index === 0}
                          isNew={!initialIds.current.has(message.id)}
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
