import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import { responsiveImage } from '@/shared/lib/images';
import styles from './Gallery.module.scss';

export interface GalleryProps {
  photos: string[];
  /** Used for alt text: "<name> — photo N". */
  name: string;
  /** `grid`: mosaic of up to 5; `hero`: one large + two stacked (detail pages). */
  layout?: 'grid' | 'hero';
  className?: string;
}

export interface LightboxProps {
  photos: string[];
  name: string;
  /** Open photo index; null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Full-screen photo viewer: arrows, Escape, focus on the close button. */
export const Lightbox: React.FC<LightboxProps> = ({ photos, name, index: open, onChange: setOpen }) => {
  const { t } = useT();
  const step = useCallback(
    (delta: number) => setOpen(open === null ? null : (open + delta + photos.length) % photos.length),
    [open, photos.length, setOpen],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, step, setOpen]);

  if (open === null || !photos[open]) return null;
  const alt = t('common.photoOf', { name, index: open + 1 });

  return createPortal(
    <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(null)}>
      <button type="button" className={clsx(styles.viewerBtn, styles.close)} onClick={() => setOpen(null)} aria-label={t('common.close')} autoFocus>
        <X size={20} />
      </button>
      <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
        <img key={open} src={photos[open].replace('-720.jpg', '-1440.jpg')} alt={alt} className={styles.viewerImage} />
        <figcaption className={styles.caption}>
          {open + 1} / {photos.length}
        </figcaption>
      </figure>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            className={clsx(styles.viewerBtn, styles.prev)}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={t('common.prevPhoto')}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className={clsx(styles.viewerBtn, styles.next)}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={t('common.nextPhoto')}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
};

/** Photo mosaic that opens the Lightbox. */
export const Gallery: React.FC<GalleryProps> = ({ photos, name, layout = 'grid', className }) => {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(null);
  const visible = photos.slice(0, layout === 'hero' ? 3 : 5);
  const hidden = photos.length - visible.length;
  const alt = (index: number) => t('common.photoOf', { name, index: index + 1 });

  return (
    <>
      <div className={clsx(styles.gallery, styles[layout], styles[`count${visible.length}`], className)}>
        {visible.map((src, index) => (
          <button key={src} type="button" className={styles.tile} onClick={() => setOpen(index)} aria-label={alt(index)}>
            <img
              {...responsiveImage(src, index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 50vw, 25vw')}
              alt={alt(index)}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {index === visible.length - 1 && photos.length > 1 && (
              <span className={styles.more}>
                <Images size={14} /> {hidden > 0 ? `+${hidden}` : t('car.allPhotos')}
              </span>
            )}
          </button>
        ))}
      </div>
      <Lightbox photos={photos} name={name} index={open} onChange={setOpen} />
    </>
  );
};
