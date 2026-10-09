import React from 'react';
import clsx from 'clsx';
import styles from './Ornament.module.scss';

/**
 * Kochkor muiuz (ram's horn) — the core motif of Kyrgyz shyrdak felt:
 * a stem that splits into two mirrored spirals, crowned with a small rhombus.
 * Strokes use pathLength=1 so they can "draw" in when revealed.
 */
const HORNS = [
  'M100 92 C100 62 118 40 144 40 C168 40 180 58 172 74 C165 87 147 84 148 71 C149 62 159 61 162 67',
  'M100 92 C100 62 82 40 56 40 C32 40 20 58 28 74 C35 87 53 84 52 71 C51 62 41 61 38 67',
];

export interface OrnamentProps {
  /** `motif`: a single horn pair; `divider`: rules on both sides of the motif. */
  variant?: 'motif' | 'divider';
  className?: string;
  /** Draw strokes in when the closest [data-reveal] ancestor is revealed. */
  animated?: boolean;
}

export const Ornament: React.FC<OrnamentProps> = ({ variant = 'motif', className, animated = true }) => {
  const motif = (
    <svg viewBox="0 0 200 100" className={styles.svg} aria-hidden="true" focusable="false">
      <g className={clsx(styles.strokes, animated && styles.animated)}>
        {HORNS.map((d) => (
          <path key={d} d={d} pathLength={1} />
        ))}
        <path d="M100 92 V100" pathLength={1} />
      </g>
      <path className={styles.rhombus} d="M100 18 L108 28 L100 38 L92 28 Z" />
    </svg>
  );

  if (variant === 'motif') return <span className={clsx(styles.motif, className)}>{motif}</span>;

  return (
    <span className={clsx(styles.divider, animated && styles.animated, className)} aria-hidden="true">
      <span className={styles.rule} />
      <span className={styles.dividerMotif}>{motif}</span>
      <span className={styles.rule} />
    </span>
  );
};
