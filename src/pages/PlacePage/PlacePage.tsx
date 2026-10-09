import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Check, ChevronLeft, ChevronRight, Compass, Plus, Route, Star } from 'lucide-react';
import { mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { useT } from '@/shared/i18n';
import { BackLink } from '@/shared/ui/BackLink';
import { GeoMap, type GeoMarker } from '@/shared/ui/GeoMap';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import styles from './PlacePage.module.scss';

/** Figma "Места → место": photo card + actions, map with pins, local hosts. */
export const PlacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, fmt } = useT();
  const place = mockPlaces.find((p) => p.id === id);
  const saved = useFavoritesStore((s) => (place ? s.favorites.includes(place.id) : false));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [photoIndex, setPhotoIndex] = useState(0);

  const markers = useMemo<GeoMarker[]>(
    () => mockPlaces.map((p) => ({ id: p.id, lat: p.coordinates.lat, lng: p.coordinates.lng, label: p.name })),
    [],
  );

  if (!place) return <Navigate to="/catalog/places" replace />;

  const hosts = mockGuides.filter((g) => place.localHostIds.includes(g.id));
  const photos = place.gallery.length > 0 ? place.gallery : [place.photoUrl];
  const step = (delta: number) => setPhotoIndex((i) => (i + delta + photos.length) % photos.length);

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/places" className={styles.back} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.slider}>
              <img
                key={photos[photoIndex]}
                src={photos[photoIndex]}
                alt={t('common.photoOf', { name: place.name, index: photoIndex + 1 })}
                className={styles.photo}
              />
              {photos.length > 1 && (
                <>
                  <button type="button" className={clsx(styles.sliderBtn, styles.prev)} onClick={() => step(-1)} aria-label={t('common.prevPhoto')}>
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className={clsx(styles.sliderBtn, styles.next)} onClick={() => step(1)} aria-label={t('common.nextPhoto')}>
                    <ChevronRight size={16} />
                  </button>
                  <span className={styles.dots} aria-hidden="true">
                    {photos.map((src, i) => (
                      <span key={src} className={clsx(styles.dot, i === photoIndex && styles.dotActive)} />
                    ))}
                  </span>
                </>
              )}
            </div>
            <h1 className={styles.caption}>
              {place.name} / {t(`regions.${place.regionId}.name`)}
            </h1>
            <p className={styles.description}>{place.description}</p>
          </div>

          <button type="button" className={styles.actionBtn} onClick={() => navigate(`/catalog/guides?region=${place.regionId}`)}>
            <Route size={22} strokeWidth={1.5} /> {t('place.stays')}
          </button>
          <button type="button" className={styles.actionBtn} onClick={() => navigate('/catalog/cars')}>
            <Compass size={22} strokeWidth={1.5} /> {t('place.travel')}
          </button>
          <button
            type="button"
            className={clsx(styles.actionBtn, saved && styles.actionSaved)}
            onClick={() => toggleFavorite(place.id)}
            aria-pressed={saved}
          >
            {saved ? <Check size={22} strokeWidth={1.8} /> : <Plus size={22} strokeWidth={1.5} />}
            {saved ? t('place.pointAdded') : t('place.addPoint')}
          </button>
        </aside>

        <GeoMap
          markers={markers}
          variant="pin"
          activeId={place.id}
          focusActive
          onSelect={(placeId) => placeId !== place.id && navigate(`/places/${placeId}`)}
          className={styles.map}
        >
          {/* Figma popover: name, rating, category */}
          <div className={styles.popover} key={place.id}>
            <p className={styles.popoverTitle}>{place.name}</p>
            <p className={styles.popoverRating}>
              {fmt.rating(place.rating)} <Star size={16} className={styles.star} /> ({place.reviewsCount})
            </p>
            <p className={styles.popoverMeta}>{place.category.split(' • ')[0]}</p>
          </div>
        </GeoMap>
      </div>

      {hosts.length > 0 && (
        <section className={styles.hosts}>
          <Reveal>
            <SectionHeading title={t('place.hostsIn', { locative: t(`regions.${place.regionId}.locative`) })} />
          </Reveal>
          <Reveal stagger className={styles.hostsGrid}>
            {hosts.map((guide, index) => (
              <GuideCard key={guide.id} guide={guide} {...revealItem(index)} />
            ))}
          </Reveal>
        </section>
      )}
    </div>
  );
};
