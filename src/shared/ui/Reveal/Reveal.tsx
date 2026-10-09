import React, { useEffect, useRef } from 'react';

type RevealElement = 'div' | 'section' | 'ul' | 'ol' | 'article' | 'header' | 'aside';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealElement;
  /**
   * `stagger`: the container stays put and its `revealItem()` children rise in sequence.
   * Default: the container itself fades/rises in.
   */
  stagger?: boolean;
  children: React.ReactNode;
}

let observer: IntersectionObserver | null = null;

const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
  }
  return observer;
};

/** Scroll-triggered reveal. Styles live in global.scss and switch off under prefers-reduced-motion. */
export const Reveal: React.FC<RevealProps> = ({ as: Tag = 'div', stagger = false, children, ...rest }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return React.createElement(
    Tag,
    { ...rest, ref, 'data-reveal': stagger ? 'stagger' : 'self' },
    children,
  );
};

/** Props for a staggered child: `<li {...revealItem(i)}>`. */
export const revealItem = (index: number) =>
  ({
    'data-reveal-item': '',
    style: { '--i': Math.min(index, 8) } as React.CSSProperties,
  }) as const;
