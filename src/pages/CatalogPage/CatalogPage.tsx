import React, { useMemo } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { MapPin, SearchX, X } from 'lucide-react';
import type { RegionId } from '@/entities/types';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { CarCard } from '@/entities/car/ui/CarCard';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import styles from './CatalogPage.module.scss';

type CatalogKind = 'guides' | 'places' | 'cars';
const KINDS: CatalogKind[] = ['guides', 'places', 'cars'];
const REGION_IDS: RegionId[] = ['bishkek', 'issyk-kul', 'naryn', 'osh', 'jalal-abad', 'batken', 'talas', 'chuy'];

const matches = (query: string, ...fields: string[]) =>
  !query || fields.some((field) => field.toLowerCase().includes(query));

/** Figma "Жители" / "Места" / "Транспорт" grids. Search & filter come from the SubNav (URL query). */
export const CatalogPage: React.FC = () => {
  const { kind: rawKind } = useParams<{ kind: string }>();
  const [params, setParams] = useSearchParams();
  const { t } = useT();
  const kind = KINDS.includes(rawKind as CatalogKind) ? (rawKind as CatalogKind) : null;
  const query = (params.get('q') ?? '').trim().toLowerCase();
  const rawRegion = params.get('region');
  const region = REGION_IDS.includes(rawRegion as RegionId) ? (rawRegion as RegionId) : null;
  const onlyGuides = params.get('guide') === '1';
  const withDriver = params.get('driver') === '1';

  const items = useMemo(() => {
    // Search also matches the region name in the current language.
    const regionName = (id: RegionId) => t(`regions.${id}.name`);
    const inRegion = (id: RegionId) => !region || id === region;

    switch (kind) {
      case 'guides':
        return mockGuides
          .filter((g) => inRegion(g.regionId))
          .filter((g) => !onlyGuides || /гид/i.test(g.roleTitle))
          .filter((g) => matches(query, g.name, g.region, g.roleTitle, regionName(g.regionId)))
          .map((g, i) => <GuideCard key={g.id} guide={g} {...revealItem(i)} />);
      case 'places':
        return mockPlaces
          .filter((p) => inRegion(p.regionId))
          .filter((p) => matches(query, p.name, p.region, p.category, regionName(p.regionId)))
          .map((p, i) => <PlaceCard key={p.id} place={p} {...revealItem(i)} />);
      case 'cars':
        return mockCars
          .filter((c) => inRegion(c.regionId))
          .filter((c) => !withDriver || c.included.some((item) => /водител/i.test(item)))
          .filter((c) => matches(query, c.name, c.region, c.type, regionName(c.regionId)))
          .map((c, i) => <CarCard key={c.id} car={c} {...revealItem(i)} />);
      default:
        return null;
    }
  }, [kind, query, region, onlyGuides, withDriver, t]);

  if (!kind || !items) return <Navigate to="/" replace />;

  const clearRegion = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('region');
        return next;
      },
      { replace: true },
    );

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">{t(`catalog.titles.${kind}`)}</h1>

      {region && (
        <div className={styles.activeFilter}>
          <button type="button" className={styles.chip} onClick={clearRegion} aria-label={`${t('common.remove')}: ${t(`regions.${region}.name`)}`}>
            <MapPin size={14} />
            {t(`regions.${region}.name`)}
            <X size={14} />
          </button>
          <span className={styles.count}>{t('common.results', { count: items.length })}</span>
        </div>
      )}

      {items.length > 0 ? (
        // Re-keyed on filter change so results animate in again.
        <Reveal
          key={[query, region, onlyGuides, withDriver].join('|')}
          stagger
          className={clsx(styles.grid, kind === 'places' && styles.placesGrid)}
        >
          {items}
        </Reveal>
      ) : (
        <EmptyState
          icon={<SearchX size={22} strokeWidth={1.6} />}
          title={t('catalog.emptyTitle')}
          text={t('catalog.emptyText')}
          action={
            <button type="button" className={styles.resetBtn} onClick={() => setParams({}, { replace: true })}>
              {t('catalog.reset')}
            </button>
          }
        />
      )}
    </div>
  );
};
