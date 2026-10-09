import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { useT } from '@/shared/i18n';
import styles from './FavoriteButton.module.scss';

export interface FavoriteButtonProps {
  id: string;
  /** `inline`: bare heart next to a title (Figma cards); `overlay`: white heart on photos; `plain`: bordered button. */
  variant?: 'inline' | 'overlay' | 'plain';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, variant = 'inline', className }) => {
  const { t } = useT();
  const favorite = useFavoritesStore((s) => s.favorites.includes(id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [pop, setPop] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavorite(id);
        setPop(true);
      }}
      onAnimationEnd={() => setPop(false)}
      className={clsx(styles.button, styles[variant], favorite && styles.active, pop && styles.pop, className)}
      aria-label={favorite ? t('common.favoriteRemove') : t('common.favoriteAdd')}
      aria-pressed={favorite}
    >
      <Heart size={variant === 'plain' ? 18 : 26} strokeWidth={1.5} />
    </button>
  );
};
