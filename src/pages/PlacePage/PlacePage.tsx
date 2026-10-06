import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Compass, MapPin, Plus, Route, Star } from 'lucide-react';
import { mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { REGION_NAMES } from '@/shared/lib/regions';
import { BackLink } from '@/shared/ui/BackLink';
import { MapBackdrop } from '@/shared/ui/MapBackdrop';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import styles from './PlacePage.module.scss';

/** Figma "Места → место" (Frame 7): photo card + actions, map with pins, local hosts. */
export const PlacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const place = mockPlaces.find((p) => p.id === id);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!place) return <Navigate to="/catalog/places" replace />;

  const region = REGION_NAMES[place.regionId];
  const hosts = mockGuides.filter((g) => place.localHostIds.includes(g.id));
  const photos = place.gallery.length > 0 ? place.gallery : [place.photoUrl];
  const saved = isFavorite(place.id);
  const step = (delta: number) => setPhotoIndex((i) => (i + delta + photos.length) % photos.length);

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/places" className={styles.back} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.slider}>
              <img src={photos[photoIndex]} alt={`${place.name} — фото ${photoIndex + 1}`} className={styles.photo} />
              {photos.length > 1 && (
                <>
                  <button type="button" className={clsx(styles.sliderBtn, styles.prev)} onClick={() => step(-1)} aria-label="Предыдущее фото">
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className={clsx(styles.sliderBtn, styles.next)} onClick={() => step(1)} aria-label="Следующее фото">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            <h1 className={styles.caption}>
              {place.name} / {region.name}
            </h1>
            <p className={styles.description}>{place.description}</p>
          </div>

          <button type="button" className={styles.actionBtn} onClick={() => navigate(`/catalog/guides?q=${encodeURIComponent(region.name)}`)}>
            <Route size={26} strokeWidth={1.5} /> Места для остановки
          </button>
          <button type="button" className={styles.actionBtn} onClick={() => navigate('/catalog/cars')}>
            <Compass size={26} strokeWidth={1.5} /> Способы путешествия
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => toggleFavorite(place.id)}
            aria-pressed={saved}
          >
            <Plus size={26} strokeWidth={1.5} /> {saved ? 'Точка добавлена' : 'Добавить точку'}
          </button>
        </aside>

        <div className={styles.map}>
          <MapBackdrop className={styles.mapSvg} />
          {mockPlaces.map((p) => {
            const isCurrent = p.id === place.id;
            return (
              <Link
                key={p.id}
                to={`/places/${p.id}`}
                className={clsx(styles.pin, isCurrent && styles.pinCurrent)}
                style={{ top: `${p.coordinates.topPercent}%`, left: `${p.coordinates.leftPercent}%` }}
                aria-label={p.name}
                title={p.name}
              >
                <MapPin size={isCurrent ? 46 : 38} strokeWidth={1.2} />
                {isCurrent && <span className={styles.pinLabel}>{p.name}</span>}
              </Link>
            );
          })}

          {/* Figma popover: name, rating, category · Open */}
          <div className={styles.popover}>
            <p className={styles.popoverTitle}>{place.name}</p>
            <p className={styles.popoverRating}>
              {place.rating} <Star size={20} className={styles.star} /> ({place.reviewsCount})
            </p>
            <p className={styles.popoverMeta}>
              {place.category.split(' • ')[0]} · <span className={styles.open}>Open</span>
            </p>
          </div>
        </div>
      </div>

      {hosts.length > 0 && (
        <section className={styles.hosts}>
          <SectionHeading title={`Хозяева ${region.locative}`} />
          <div className={styles.hostsGrid}>
            {hosts.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
