import React, { useMemo } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { CalendarDays, MapPin, SearchX, Users, X } from 'lucide-react';
import type { RegionId } from '@/entities/types';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { CarCard } from '@/entities/car/ui/CarCard';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { StayCard, useCatalogStays } from '@/entities/stay';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { nightsBetween, parseInputDate } from '@/shared/lib/date';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import styles from './CatalogPage.module.scss';

type CatalogKind = 'stays' | 'guides' | 'places' | 'cars';
const KINDS: CatalogKind[] = ['stays', 'guides', 'places', 'cars'];

const REGION_IDS: RegionId[] = ['bishkek', 'issyk-kul', 'naryn', 'osh', 'jalal-abad', 'batken', 'talas', 'chuy'];

const matches = (query: string, ...fields: string[]) =>
  !query || fields.some((field) => field.toLowerCase().includes(query));

/** Figma "Жители" / "Места" / "Транспорт" grids. Search & filter come from the SubNav (URL query). */
export const CatalogPage: React.FC = () => {
  const { kind: rawKind } = useParams<{ kind: string }>();
  const [params, setParams] = useSearchParams();
  const { t, fmt } = useT();
  const kind = KINDS.includes(rawKind as CatalogKind) ? (rawKind as CatalogKind) : null;
  const query = (params.get('q') ?? '').trim().toLowerCase();
  const rawRegion = params.get('region');
  const region = REGION_IDS.includes(rawRegion as RegionId) ? (rawRegion as RegionId) : null;
  const onlyGuides = params.get('guide') === '1';
  const withDriver = params.get('driver') === '1';
  const stays = useCatalogStays();
  const guests = Math.max(0, Math.min(20, Number(params.get('guests')) || 0));
  const checkIn = parseInputDate(params.get('checkIn'));
  const checkOut = parseInputDate(params.get('checkOut'));
  const nights = nightsBetween(checkIn, checkOut);
  const stayQuery = new URLSearchParams(
    Object.entries({ checkIn, checkOut, guests: guests ? String(guests) : null }).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  ).toString();

  const items = useMemo(() => {
    // Search also matches the region name in the current language.
    const regionName = (id: RegionId) => t(`regions.${id}.name`);
    const inRegion = (id: RegionId) => !region || id === region;

    switch (kind) {
      case 'stays': {
        const list = stays
          .filter((s) => inRegion(s.regionId))
          .filter((s) => !guests || s.maxGuests >= guests)
          .filter((s) => matches(query, s.title, s.location, regionName(s.regionId), t(`stays.types.${s.propertyType}`)));
        return list.map((s, i) => (
          <StayCard key={s.id} stay={s} nights={nights || undefined} linkQuery={stayQuery} {...revealItem(i)} />
        ));
      }
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
  }, [kind, query, region, onlyGuides, withDriver, t, stays, guests, nights, stayQuery]);

  if (!kind || !items) return <Navigate to="/" replace />;

  const setParam = (updates: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  const clearRegion = () => setParam({ region: null });
  const shortDate = (iso: string) => fmt.date(iso, { day: 'numeric', month: 'short' });

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">{t(`catalog.titles.${kind}`)}</h1>

      {kind === 'stays' && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarHead}>
            <div>
              <h2 className={styles.toolbarTitle}>{t('stays.catalogTitle')}</h2>
              <p className={styles.toolbarText}>{t('stays.catalogSubtitle')}</p>
            </div>
          </div>
          {(guests > 0 || nights > 0) && (
            <div className={styles.activeFilter}>
              {nights > 0 && checkIn && checkOut && (
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => setParam({ checkIn: null, checkOut: null })}
                  aria-label={`${t('common.remove')}: ${shortDate(checkIn)} – ${shortDate(checkOut)}`}
                >
                  <CalendarDays size={14} />
                  {shortDate(checkIn)} – {shortDate(checkOut)} · {t('booking.nights', { count: nights })}
                  <X size={14} />
                </button>
              )}
              {guests > 0 && (
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => setParam({ guests: null })}
                  aria-label={`${t('common.remove')}: ${t('common.guests', { count: guests })}`}
                >
                  <Users size={14} />
                  {t('common.guests', { count: guests })}
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          <p className={styles.markupNote}>{t('stays.priceNote')}</p>
        </div>
      )}

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
          key={[query, region, onlyGuides, withDriver, guests, nights].join('|')}
          stagger
          className={clsx(styles.grid, kind === 'places' && styles.placesGrid, kind === 'stays' && styles.staysGrid)}
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
