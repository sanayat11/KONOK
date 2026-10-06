import React, { useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { mockGuides } from '@/shared/api/mocks';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { BackLink } from '@/shared/ui/BackLink';
import { TitledPanel } from '@/shared/ui/TitledPanel';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { StartChatButton } from '@/features/StartChat';
import styles from './GuidePage.module.scss';

/** Figma "Профиль жителя" (Frame 5): profile card on the left, media + reviews on the right. */
export const GuidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const guide = mockGuides.find((g) => g.id === id);
  const openBookingModal = useBookingStore((s) => s.openBookingModal);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (!guide) return <Navigate to="/catalog/guides" replace />;

  const fullName = guide.fullName ?? guide.name;

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/guides" className={styles.back} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <img src={guide.avatarUrl} alt={fullName} className={styles.photo} />
            <p className={styles.caption}>
              {fullName} / {guide.region}
            </p>
            <dl className={styles.stats}>
              <div>
                <dt>Максимум гостей:</dt>
                <dd>{guide.maxGuests ?? '—'}</dd>
              </div>
              <div>
                <dt>Рейтинг:</dt>
                <dd>
                  <Star size={22} className={styles.star} aria-hidden="true" />
                  {guide.rating} / ({guide.reviewsCount})
                </dd>
              </div>
              <div>
                <dt>Цена:</dt>
                <dd>{guide.pricePerDay}с/1день</dd>
              </div>
            </dl>
            <div className={styles.about}>
              <h2 className={styles.aboutTitle}>Обо мне</h2>
              <p>{guide.bio}</p>
            </div>
          </div>

          <StartChatButton
            listingType="guide"
            listingId={guide.id}
            ownerId={guide.id}
            className={styles.primaryBtn}
          >
            Написать
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
            Забронировать
          </button>
        </aside>

        <div className={styles.content}>
          <TitledPanel title="Видео и фотографии">
            <div className={styles.galleryRow}>
              <div className={styles.gallery} ref={galleryRef}>
                {guide.gallery.map((src, index) => (
                  <img key={src} src={src} alt={`Фото ${index + 1}`} className={styles.galleryItem} loading="lazy" />
                ))}
              </div>
              <button
                type="button"
                className={styles.galleryNext}
                aria-label="Следующие фото"
                onClick={() => galleryRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              >
                <ChevronRight size={34} />
              </button>
            </div>
          </TitledPanel>

          <TitledPanel title="Отзывы">
            <ReviewList reviews={guide.reviews} />
          </TitledPanel>
        </div>
      </div>
    </div>
  );
};
