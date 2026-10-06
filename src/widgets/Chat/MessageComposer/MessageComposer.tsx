import React, { useLayoutEffect, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';
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
  placeholder = 'Напишите сообщение…',
  inputRef,
}) => {
  const ownRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? ownRef;
  const canSend = text.trim().length > 0;

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
        placeholder={placeholder}
        aria-label="Текст сообщения"
        rows={1}
        maxLength={MAX_LENGTH}
      />
      <button type="submit" className={styles.send} disabled={!canSend} aria-label="Отправить">
        <SendHorizontal size={20} />
      </button>
    </form>
  );
};
