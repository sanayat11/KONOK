import React, { useMemo } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { SearchX } from 'lucide-react';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { CarCard } from '@/entities/car/ui/CarCard';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import styles from './CatalogPage.module.scss';

type CatalogKind = 'guides' | 'places' | 'cars';

const TITLES: Record<CatalogKind, string> = {
  guides: 'Жители',
  places: 'Места',
  cars: 'Транспорт',
};

const matches = (query: string, ...fields: string[]) =>
  !query || fields.some((field) => field.toLowerCase().includes(query));

/** Figma "Жители" / "Места" / "Транспорт" catalog grids. Search & filter come from the SubNav (URL query). */
export const CatalogPage: React.FC = () => {
  const { kind } = useParams<{ kind: string }>();
  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim().toLowerCase();
  const onlyGuides = params.get('guide') === '1';
  const withDriver = params.get('driver') === '1';

  const items = useMemo(() => {
    switch (kind) {
      case 'guides':
        return mockGuides
          .filter((g) => !onlyGuides || /гид/i.test(g.roleTitle))
          .filter((g) => matches(query, g.name, g.region, g.roleTitle))
          .map((g) => <GuideCard key={g.id} guide={g} />);
      case 'places':
        return mockPlaces
          .filter((p) => matches(query, p.name, p.region, p.category))
          .map((p) => <PlaceCard key={p.id} place={p} />);
      case 'cars':
        return mockCars
          .filter((c) => !withDriver || c.included.some((item) => /водител/i.test(item)))
          .filter((c) => matches(query, c.name, c.region, c.type))
          .map((c) => <CarCard key={c.id} car={c} />);
      default:
        return null;
    }
  }, [kind, query, onlyGuides, withDriver]);

  if (!items) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">{TITLES[kind as CatalogKind]}</h1>
      {items.length > 0 ? (
        <div className={clsx(styles.grid, kind === 'places' && styles.placesGrid)}>{items}</div>
      ) : (
        <div className={styles.empty}>
          <SearchX size={40} strokeWidth={1.5} />
          <p className={styles.emptyTitle}>Ничего не найдено</p>
          <p>Попробуйте изменить запрос или снять фильтр.</p>
        </div>
      )}
    </div>
  );
};
