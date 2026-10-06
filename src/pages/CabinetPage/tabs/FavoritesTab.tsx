import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { CarCard } from '@/entities/car/ui/CarCard';
import styles from './FavoritesTab.module.scss';
import t from './tabs.module.scss';

type Filter = 'all' | 'guides' | 'places' | 'cars';

/** Figma "Избранное": filter pills and three sections of saved cards. */
export const FavoritesTab: React.FC = () => {
  const favorites = useFavoritesStore((s) => s.favorites);
  const [filter, setFilter] = useState<Filter>('all');

  const guides = mockGuides.filter((g) => favorites.includes(g.id));
  const places = mockPlaces.filter((p) => favorites.includes(p.id));
  const cars = mockCars.filter((c) => favorites.includes(c.id));
  const show = (f: Filter) => filter === 'all' || filter === f;
  const nothing = guides.length + places.length + cars.length === 0;

  return (
    <div className={styles.favorites}>
      <div>
        <h1 className={t.pageTitle}>Избранное</h1>
        <p className={t.pageSubtitle}>Всё, что вы сохранили для будущих путешествий.</p>
      </div>

      <div className={t.filterTabs} role="tablist">
        {(
          [
            ['all', 'Все'],
            ['guides', 'Жители'],
            ['places', 'Места'],
            ['cars', 'Транспорт'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={clsx(t.filterTab, filter === id && t.filterActive)}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {nothing ? (
        <div className={clsx(t.panel, t.empty)}>
          <Heart size={36} />
          <p className={t.emptyTitle}>Здесь пока пусто</p>
          <p>
            Нажимайте ♡ на карточках <Link to="/catalog/guides">жителей</Link>, <Link to="/catalog/places">мест</Link> и{' '}
            <Link to="/catalog/cars">транспорта</Link>.
          </p>
        </div>
      ) : (
        <>
          {show('guides') && guides.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Любимые жители</h2>
              <div className={styles.grid}>
                {guides.map((g) => (
                  <GuideCard key={g.id} guide={g} />
                ))}
              </div>
            </section>
          )}
          {show('places') && places.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Любимые места</h2>
              <div className={styles.grid}>
                {places.map((p) => (
                  <PlaceCard key={p.id} place={p} />
                ))}
              </div>
            </section>
          )}
          {show('cars') && cars.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Любимый транспорт</h2>
              <div className={styles.grid}>
                {cars.map((c) => (
                  <CarCard key={c.id} car={c} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
