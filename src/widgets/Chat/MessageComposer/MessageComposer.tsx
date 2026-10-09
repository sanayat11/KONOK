import React, { useLayoutEffect, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import styles from './MessageComposer.module.scss';

const MAX_LENGTH = 2000;
const MAX_HEIGHT = 140;

export interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  value: text,
  onChange: setText,
  onSend,
  placeholder,
  inputRef,
}) => {
  const { t } = useT();
  const ownRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? ownRef;
  const canSend = text.trim().length > 0;
  const nearLimit = text.length > MAX_LENGTH * 0.9;

  // Grow with content up to MAX_HEIGHT, then scroll.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [text, textareaRef]);

  const submit = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
    textareaRef.current?.focus();
  };

  return (
    <form
      className={styles.composer}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className={styles.inputWrap}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter adds a line break (ignored mid-IME composition).
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder ?? t('chat.composerPlaceholder')}
          aria-label={t('chat.composerLabel')}
          aria-describedby="composer-hint"
          rows={1}
          maxLength={MAX_LENGTH}
        />
        <span id="composer-hint" className={styles.hint}>
          {nearLimit ? `${text.length} / ${MAX_LENGTH}` : t('chat.composerHint')}
        </span>
      </div>
      <button type="submit" className={clsx(styles.send, canSend && styles.ready)} disabled={!canSend} aria-label={t('chat.send')}>
        <SendHorizontal size={18} />
      </button>
    </form>
  );
};
