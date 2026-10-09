import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Avatar.module.scss';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  /** Decorative avatars next to a visible name get an empty alt. */
  decorative?: boolean;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** Round photo with an initials fallback when the image is missing or fails. */
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 40, className, decorative = true }) => {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) } as React.CSSProperties;

  if (!src || failed) {
    return (
      <span className={clsx(styles.avatar, styles.fallback, className)} style={style} aria-hidden={decorative} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name}>
        {initials(name) || '·'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={decorative ? '' : name}
      className={clsx(styles.avatar, className)}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};
