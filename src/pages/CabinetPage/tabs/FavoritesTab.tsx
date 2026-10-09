import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { CarCard } from '@/entities/car/ui/CarCard';
import styles from './FavoritesTab.module.scss';
import t$ from './tabs.module.scss';

type Filter = 'all' | 'guides' | 'places' | 'cars';

/** Figma "Избранное": filter pills and three sections of saved cards. */
export const FavoritesTab: React.FC = () => {
  const { t } = useT();
  const favorites = useFavoritesStore((s) => s.favorites);
  const [filter, setFilter] = useState<Filter>('all');

  const guides = mockGuides.filter((g) => favorites.includes(g.id));
  const places = mockPlaces.filter((p) => favorites.includes(p.id));
  const cars = mockCars.filter((c) => favorites.includes(c.id));
  const show = (f: Filter) => filter === 'all' || filter === f;
  const nothing = guides.length + places.length + cars.length === 0;

  return (
    <div className={t$.tab}>
      <div>
        <h1 className={t$.pageTitle}>{t('cabinet.favorites.title')}</h1>
        <p className={t$.pageSubtitle}>{t('cabinet.favorites.subtitle')}</p>
      </div>

      <div className={t$.filterTabs} role="tablist" aria-label={t('cabinet.favorites.title')}>
        {(['all', 'guides', 'places', 'cars'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={clsx(t$.filterTab, filter === id && t$.filterActive)}
            onClick={() => setFilter(id)}
          >
            {t(`cabinet.favorites.${id}`)}
          </button>
        ))}
      </div>

      {nothing ? (
        <EmptyState
          icon={<Heart size={22} />}
          title={t('cabinet.favorites.emptyTitle')}
          text={t('cabinet.favorites.emptyText')}
          action={<Link to="/catalog/places">{t('cabinet.favorites.emptyCta')}</Link>}
        />
      ) : (
        <div key={filter} className={styles.sections}>
          {show('guides') && guides.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('cabinet.favorites.lovedGuides')}</h2>
              <Reveal stagger className={styles.grid}>
                {guides.map((g, i) => (
                  <GuideCard key={g.id} guide={g} {...revealItem(i)} />
                ))}
              </Reveal>
            </section>
          )}
          {show('places') && places.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('cabinet.favorites.lovedPlaces')}</h2>
              <Reveal stagger className={styles.grid}>
                {places.map((p, i) => (
                  <PlaceCard key={p.id} place={p} {...revealItem(i)} />
                ))}
              </Reveal>
            </section>
          )}
          {show('cars') && cars.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('cabinet.favorites.lovedCars')}</h2>
              <Reveal stagger className={styles.grid}>
                {cars.map((c, i) => (
                  <CarCard key={c.id} car={c} {...revealItem(i)} />
                ))}
              </Reveal>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
