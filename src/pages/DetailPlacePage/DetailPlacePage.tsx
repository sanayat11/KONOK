import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Share2, MessageCircle, CalendarPlus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { mockPlaces } from '@/shared/api/mocks/places';
import { mockGuides } from '@/shared/api/mocks/guides';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './DetailPlacePage.module.scss';

export const DetailPlacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openBookingModal } = useBookingStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const place = mockPlaces.find((p) => p.id === id) || mockPlaces[0]; // Default to Tash-Rabat
  const [photoIndex, setPhotoIndex] = useState(0);
  const favorite = isFavorite(place.id);

  const gallery = place.gallery.length > 0 ? place.gallery : [
    place.photoUrl,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
  ];

  // Local hosts for this place
  const localHosts = mockGuides.filter((g) =>
    place.localHostIds.includes(g.id) || g.regionId === place.regionId
  ).slice(0, 4);

  const handleBooking = () => {
    openBookingModal({
      type: 'place',
      itemId: place.id,
      itemTitle: `Экскурсия и тур: ${place.name}`,
      pricePerDay: 4500,
      photoUrl: place.photoUrl,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* Top 2-Column Section */}
        <div className={styles.topGrid}>
          {/* Left Column: Image Slider & Overview */}
          <div className={styles.leftColumn}>
            <div className={styles.sliderCard}>
              <div className={styles.sliderWrap}>
                <img
                  src={gallery[photoIndex]}
                  alt={place.name}
                  className={styles.sliderImage}
                />
                <button
                  className={clsx(styles.sliderArrow, styles.arrowLeft)}
                  onClick={() =>
                    setPhotoIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                  }
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className={clsx(styles.sliderArrow, styles.arrowRight)}
                  onClick={() =>
                    setPhotoIndex((prev) => (prev + 1) % gallery.length)
                  }
                >
                  <ChevronRight size={22} />
                </button>

                {/* Favorite & Share overlay */}
                <div className={styles.topActions}>
                  <button
                    className={clsx(styles.actionCircleBtn, favorite && styles.isFav)}
                    onClick={() => toggleFavorite(place.id)}
                    title="В избранное"
                  >
                    <Heart size={18} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#1E293B'} />
                  </button>
                  <button
                    className={styles.actionCircleBtn}
                    onClick={() => alert('Ссылка скопирована в буфер обмена!')}
                    title="Поделиться"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Description Content */}
              <div className={styles.placeBody}>
                <div className={styles.placeCategory}>
                  <MapPin size={15} />
                  <span>{place.region} • {place.category}</span>
                </div>
                <h1 className={styles.placeTitle}>{place.name}</h1>
                <p className={styles.placeDesc}>{place.description}</p>

                {/* Highlights */}
                <div className={styles.highlightsWrap}>
                  {place.highlights.map((h, i) => (
                    <div key={i} className={styles.highlightItem}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Buttons */}
                <div className={styles.actionsRow}>
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle size={18} />}
                    onClick={() => alert(`Связываемся с гидами в регионе ${place.region}...`)}
                  >
                    Связаться с гидом
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<CalendarPlus size={18} />}
                    onClick={handleBooking}
                  >
                    Добавить в тур
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Region Map Card */}
          <div className={styles.rightColumn}>
            <div className={styles.mapCard}>
              <div className={styles.mapHeader}>
                <span className={styles.mapRegionTag}>РЕГИОН</span>
                <h3 className={styles.mapTitle}>{place.region}</h3>
              </div>

              <div className={styles.mapViewport}>
                {/* SVG styled vector map representation */}
                <svg viewBox="0 0 400 320" className={styles.miniMapSvg}>
                  <rect width="400" height="320" fill="#E2ECE9" rx="12" />
                  <path
                    d="M 20 280 Q 100 200, 200 180 T 380 140 L 390 310 L 10 310 Z"
                    fill="#D5DFDC"
                  />
                  <ellipse cx="280" cy="120" rx="45" ry="18" fill="#38BDF8" opacity="0.8" />
                  
                  {/* Region Pins */}
                  <circle cx="200" cy="160" r="14" fill="#EF4444" opacity="0.85" />
                  <circle cx="200" cy="160" r="6" fill="#FFFFFF" />
                  
                  <circle cx="150" cy="130" r="8" fill="#EF4444" opacity="0.6" />
                  <circle cx="260" cy="140" r="8" fill="#EF4444" opacity="0.6" />
                  <circle cx="240" cy="190" r="8" fill="#EF4444" opacity="0.6" />
                </svg>

                {/* Marker Callout */}
                <div className={styles.markerCallout}>
                  <div className={styles.calloutTitle}>{place.name}</div>
                  <div className={styles.calloutRating}>
                    ★ {place.rating} <span>({place.reviewsCount})</span>
                  </div>
                  <div className={styles.calloutLoc}>{place.category}</div>
                </div>
              </div>

              <div className={styles.mapFooterNote}>
                Координаты: {place.coordinates.lat}° N, {place.coordinates.lng}° E
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Хозяева в регионе */}
        <section className={styles.hostsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.hostsTitle}>Хозяева в {place.region}</h2>
            <p className={styles.hostsSubtitle}>
              Местные жители и проверенные проводники, готовые встретить вас в этом месте
            </p>
          </div>

          <div className={styles.hostsGrid}>
            {localHosts.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
