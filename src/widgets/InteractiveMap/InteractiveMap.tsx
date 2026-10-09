import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Users, X } from 'lucide-react';
import type { RegionId } from '@/entities/types';
import { mockCars, mockGuides, mockPlaces } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { GeoMap, type GeoMarker } from '@/shared/ui/GeoMap';
import styles from './InteractiveMap.module.scss';

type PointId = 'bishkek' | 'issykKul' | 'karakol' | 'naryn' | 'sonKul' | 'osh' | 'alay' | 'jalalAbad' | 'batken';

interface MapPoint {
  id: PointId;
  lat: number;
  lng: number;
  regionId: RegionId;
}

// Real coordinates of each destination cluster.
const MAP_POINTS: MapPoint[] = [
  { id: 'bishkek', lat: 42.87, lng: 74.59, regionId: 'chuy' },
  { id: 'issykKul', lat: 42.65, lng: 77.08, regionId: 'issyk-kul' },
  { id: 'karakol', lat: 42.49, lng: 78.39, regionId: 'issyk-kul' },
  { id: 'naryn', lat: 41.43, lng: 75.99, regionId: 'naryn' },
  { id: 'sonKul', lat: 41.83, lng: 75.13, regionId: 'naryn' },
  { id: 'osh', lat: 40.53, lng: 72.8, regionId: 'osh' },
  { id: 'alay', lat: 39.65, lng: 73.3, regionId: 'osh' },
  { id: 'jalalAbad', lat: 41.83, lng: 71.97, regionId: 'jalal-abad' },
  { id: 'batken', lat: 40.06, lng: 70.82, regionId: 'batken' },
];

/** Real number of listings in the region — the same set the "view" links open. */
const regionCount = (regionId: RegionId) =>
  [...mockGuides, ...mockPlaces, ...mockCars].filter((item) => item.regionId === regionId).length;

/** Home "Откройте регионы": topographic map with destination clusters and a detail card. */
export const InteractiveMap: React.FC = () => {
  const { t } = useT();
  const [selectedId, setSelectedId] = useState<PointId | null>('issykKul');
  const selected = MAP_POINTS.find((pt) => pt.id === selectedId) ?? null;

  const markers = useMemo<GeoMarker[]>(
    () =>
      MAP_POINTS.map((pt) => ({
        id: pt.id,
        lat: pt.lat,
        lng: pt.lng,
        count: regionCount(pt.regionId),
        label: t(`map.points.${pt.id}.name`),
      })),
    [t],
  );

  return (
    <div className={styles.mapWidget}>
      <GeoMap
        markers={markers}
        variant="cluster"
        activeId={selectedId}
        onSelect={(id) => setSelectedId(id as PointId)}
        focusActive={false}
        className={styles.map}
      >
        {selected && (
          <div className={styles.pointDetailCard} key={selected.id} aria-live="polite">
            <div className={styles.pointHeader}>
              <div>
                <span className={styles.pointTag}>{t(`map.points.${selected.id}.category`)}</span>
                <h3 className={styles.pointTitle}>{t(`map.points.${selected.id}.name`)}</h3>
              </div>
              <button type="button" className={styles.closeCardBtn} onClick={() => setSelectedId(null)} aria-label={t('common.close')}>
                <X size={16} />
              </button>
            </div>
            <p className={styles.pointDesc}>{t(`map.points.${selected.id}.desc`)}</p>
            <div className={styles.pointActions}>
              <Link to={`/catalog/guides?region=${selected.regionId}`} className={styles.viewGuidesBtn}>
                <Users size={15} />
                {t('map.viewResidents')} ({regionCount(selected.regionId)})
              </Link>
              <Link to={`/catalog/places?region=${selected.regionId}`} className={styles.viewPlacesBtn}>
                <ExternalLink size={15} />
                {t('map.viewPlaces')}
              </Link>
            </div>
          </div>
        )}
      </GeoMap>
    </div>
  );
};
