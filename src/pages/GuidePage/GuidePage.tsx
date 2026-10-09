import React, { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { mockGuides } from '@/shared/api/mocks';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { useT } from '@/shared/i18n';
import { BackLink } from '@/shared/ui/BackLink';
import { Lightbox } from '@/shared/ui/Gallery';
import { Reveal } from '@/shared/ui/Reveal';
import { TitledPanel } from '@/shared/ui/TitledPanel';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { StartChatButton } from '@/features/StartChat';
import styles from './GuidePage.module.scss';

/** Figma "Профиль жителя": profile card on the left, media + reviews on the right. */
export const GuidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, fmt } = useT();
  const guide = mockGuides.find((g) => g.id === id);
  const openBookingModal = useBookingStore((s) => s.openBookingModal);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<number | null>(null);

  if (!guide) return <Navigate to="/catalog/guides" replace />;

  const fullName = guide.fullName ?? guide.name;

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/guides" className={styles.back} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.photoWrap}>
              <img src={guide.avatarUrl} alt={fullName} className={styles.photo} />
            </div>
            <p className={styles.caption}>
              {fullName} / {guide.region}
            </p>
            <dl className={styles.stats}>
              <div>
                <dt>{t('guide.maxGuests')}</dt>
                <dd>{guide.maxGuests ?? '—'}</dd>
              </div>
              <div>
                <dt>{t('guide.rating')}</dt>
                <dd>
                  <Star size={18} className={styles.star} aria-hidden="true" />
                  {fmt.rating(guide.rating)} / ({guide.reviewsCount})
                </dd>
              </div>
              <div>
                <dt>{t('guide.price')}</dt>
                <dd>{fmt.pricePerDay(guide.pricePerDay)}</dd>
              </div>
            </dl>
            <div className={styles.about}>
              <h2 className={styles.aboutTitle}>{t('guide.about')}</h2>
              <p>{guide.bio}</p>
            </div>
          </div>

          <StartChatButton listingType="guide" listingId={guide.id} ownerId={guide.id} className={styles.primaryBtn}>
            {t('guide.write')}
          </StartChatButton>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() =>
              openBookingModal({
                type: 'guide',
                itemId: guide.id,
                itemTitle: fullName,
                pricePerDay: guide.pricePerDay,
                photoUrl: guide.avatarUrl,
              })
            }
          >
            {t('guide.book')}
          </button>
        </aside>

        <div className={styles.content}>
          <Reveal>
            <TitledPanel title={t('guide.media')}>
              {guide.gallery.length > 0 ? (
                <div className={styles.galleryRow}>
                  <div className={styles.gallery} ref={galleryRef}>
                    {guide.gallery.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        className={styles.galleryItem}
                        onClick={() => setViewer(index)}
                        aria-label={t('common.photoOf', { name: fullName, index: index + 1 })}
                      >
                        <img src={src.replace('-1440.jpg', '-720.jpg')} alt="" loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.galleryNext}
                    aria-label={t('common.nextPhoto')}
                    onClick={() => galleryRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
                  >
                    <ChevronRight size={30} />
                  </button>
                </div>
              ) : (
                <p className={styles.muted}>{t('guide.noPhotos')}</p>
              )}
            </TitledPanel>
          </Reveal>

          <Reveal>
            <TitledPanel title={t('guide.reviews')}>
              <ReviewList reviews={guide.reviews} />
            </TitledPanel>
          </Reveal>
        </div>
      </div>

      <Lightbox photos={guide.gallery} name={fullName} index={viewer} onChange={setViewer} />
    </div>
  );
};
