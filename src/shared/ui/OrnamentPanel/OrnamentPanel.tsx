import React from 'react';
import clsx from 'clsx';
import styles from './OrnamentPanel.module.scss';

/** Kyrgyz "kochkor muiuz" (ram's horn) corner motif. */
const Horn: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 400 400" aria-hidden="true">
    <path
      className={styles.shapeA}
      d="M0 0h230c-20 40-70 52-104 30-30-20-62 6-46 40 14 30 58 22 62-6 34 22 22 82-26 92-62 14-110-40-90-100C34 44 18 22 0 22z"
    />
    <path
      className={styles.shapeB}
      d="M0 120c36-6 70 18 74 56 6 54-58 88-74 140v84h20c6-56 72-80 86-138 14-56-24-118-106-142z"
    />
    <path
      className={styles.shapeB}
      d="M150 150c30-10 62 2 76 30 18 36-6 80-46 82 26-22 18-62-12-70-22-6-30 10-18 24-34 0-30-56 0-66z"
    />
    <path
      className={styles.shapeA}
      d="M260 0h140v120c-28-36-74-30-90 4-12 26 10 52 34 44-30 36-92 10-92-44 0-58 50-74 8-124z"
    />
  </svg>
);

export interface OrnamentPanelProps {
  tone?: 'beige' | 'sky' | 'navy';
  className?: string;
  children: React.ReactNode;
}

/** Figma auth backdrop: rounded panel with ornaments in all four corners. */
export const OrnamentPanel: React.FC<OrnamentPanelProps> = ({ tone = 'beige', className, children }) => (
  <div className={clsx(styles.panel, styles[tone], className)}>
    <Horn className={clsx(styles.horn, styles.tl)} />
    <Horn className={clsx(styles.horn, styles.tr)} />
    <Horn className={clsx(styles.horn, styles.bl)} />
    <Horn className={clsx(styles.horn, styles.br)} />
    <div className={styles.content}>{children}</div>
  </div>
);
