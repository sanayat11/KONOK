import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useChatStore, type ChatListingType } from '@/entities/chat';

export interface StartChatButtonProps {
  listingType: ChatListingType;
  listingId: string;
  /** Owner of the listing — the button is hidden for them and for other owners. */
  ownerId: string;
  className?: string;
  children: React.ReactNode;
}

/** Opens (or creates) the guest's conversation with the listing owner. Styling comes from the caller. */
export const StartChatButton: React.FC<StartChatButtonProps> = ({
  listingType,
  listingId,
  ownerId,
  className,
  children,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openThread = useChatStore((s) => s.openThread);

  // Only guests start conversations, and never with themselves.
  if (user && (user.role !== 'tourist' || user.id === ownerId)) return null;

  const handleClick = () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    const threadId = openThread(listingType, listingId, user.id);
    if (threadId) navigate(`/messages/${threadId}`);
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
