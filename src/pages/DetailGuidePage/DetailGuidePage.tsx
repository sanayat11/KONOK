import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare, Calendar, ChevronRight, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { mockGuides } from '@/shared/api/mocks/guides';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './DetailGuidePage.module.scss';

export const DetailGuidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openBookingModal } = useBookingStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const guide = mockGuides.find((g) => g.id === id) || mockGuides[7]; // Default to Ruslan
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const favorite = isFavorite(guide.id);

  const galleryImages = guide.gallery.length > 0 ? guide.gallery : [
    guide.avatarUrl,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
  ];

  const handleBooking = () => {
    openBookingModal({
      type: 'guide',
      itemId: guide.id,
      itemTitle: `Индивидуальный тур с гидом ${guide.fullName || guide.name}`,
      pricePerDay: guide.pricePerDay,
      photoUrl: guide.avatarUrl,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Link */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* Main 2-Column Content */}
        <div className={styles.layoutGrid}>
          {/* Left Column: Profile Card & Actions */}
          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              <img
                src={guide.avatarUrl}
                alt={guide.name}
                className={styles.avatarImg}
              />
              <button
                className={clsx(styles.favBtn, favorite && styles.isFav)}
                onClick={() => toggleFavorite(guide.id)}
              >
                <Heart size={20} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#1E293B'} />
              </button>
            </div>

            <div className={styles.profileHeader}>
              <h1 className={styles.guideName}>
                {guide.fullName || guide.name} <span className={styles.guideRegion}>/ {guide.region}</span>
              </h1>
            </div>

            {/* Stats Bar */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Специализация</span>
                <span className={styles.statValue}>{guide.roleTitle}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Рейтинг</span>
                <span className={styles.statValue}>
                  <Star size={15} fill="#F59E0B" color="#F59E0B" />
                  <strong>{guide.rating}</strong> ({guide.reviewsCount})
                </span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Языки</span>
                <span className={styles.statValue}>{guide.languages.join(', ')}</span>
              </div>
            </div>

            {/* Price badge */}
            <div className={styles.priceRow}>
              <span className={styles.priceAmount}>{guide.pricePerDay.toLocaleString()} сом</span>
              <span className={styles.pricePeriod}>/ в день</span>
            </div>

            {/* Bio */}
            <div className={styles.bioSection}>
              <h3 className={styles.bioTitle}>Обо мне</h3>
              <p className={styles.bioText}>{guide.bio}</p>
            </div>

            {/* Services */}
            <div className={styles.servicesSection}>
              <h4 className={styles.subTitle}>Услуги и направления:</h4>
              <div className={styles.servicesPills}>
                {guide.services.map((srv, idx) => (
                  <span key={idx} className={styles.servicePill}>
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<MessageSquare size={18} />}
                onClick={() => alert(`Чат с гидом ${guide.name} открыт! Тел/WhatsApp: ${guide.phone || '+996 702 11-22-33'}`)}
              >
                Написать
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Calendar size={18} />}
                onClick={handleBooking}
              >
                Забронировать
              </Button>
            </div>

            <div className={styles.safeNotice}>
              <ShieldCheck size={16} className={styles.shieldIcon} />
              <span>Проверенный локальный гид KONOK</span>
            </div>
          </div>

          {/* Right Column: Photo Gallery & Reviews */}
          <div className={styles.rightColumn}>
            {/* Gallery Section */}
            <div className={styles.galleryCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.cardTitle}>Видео и фотографии</h3>
                <span className={styles.photoCounter}>
                  {galleryImages.length} фото
                </span>
              </div>

              <div className={styles.galleryGrid}>
                <div className={styles.mainPhotoWrap}>
                  <img
                    src={galleryImages[activePhotoIndex]}
                    alt="Фото локации"
                    className={styles.mainPhoto}
                  />
                  <button
                    className={styles.nextArrowBtn}
                    onClick={() =>
                      setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length)
                    }
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>

                <div className={styles.thumbnailsRow}>
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      className={clsx(
                        styles.thumbBtn,
                        activePhotoIndex === idx && styles.activeThumb
                      )}
                      onClick={() => setActivePhotoIndex(idx)}
                    >
                      <img src={imgUrl} alt={`Миниатюра ${idx + 1}`} className={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className={styles.reviewsCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.cardTitle}>Отзывы путешественников</h3>
                <span className={styles.ratingSummary}>
                  ★ {guide.rating} на основе {guide.reviewsCount} отзывов
                </span>
              </div>

              <div className={styles.reviewsList}>
                {guide.reviews.map((rev) => (
                  <div key={rev.id} className={styles.reviewItem}>
                    <div className={styles.reviewerHeader}>
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className={styles.reviewerAvatar}
                      />
                      <div>
                        <div className={styles.reviewerName}>{rev.authorName}</div>
                        <div className={styles.reviewDate}>{rev.date}</div>
                      </div>
                      <div className={styles.reviewRating}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className={styles.reviewText}>{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
