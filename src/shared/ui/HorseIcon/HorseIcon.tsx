import React from 'react';

export type HorseIconProps = { size?: number; strokeWidth?: number; className?: string };

/** lucide has no horse; a small glyph drawn in the same stroke style. */
export const HorseIcon: React.FC<HorseIconProps> = ({ size = 24, strokeWidth = 2, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 21v-6c0-3.5 2.2-6.2 5.6-7.2L15 4l1.2 3.2L19 9l-1.2 3.1-2.8-.9-1 2.3V21" />
    <path d="M7 15c-2 0-3.2-1.2-3.2-3.2" />
    <path d="M10.5 21v-4.5" />
  </svg>
);
