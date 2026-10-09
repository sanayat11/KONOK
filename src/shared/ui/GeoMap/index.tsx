import React, { lazy, Suspense } from 'react';
import clsx from 'clsx';
import type { GeoMapProps } from './GeoMap';

export type { GeoMarker, GeoMapProps } from './GeoMap';

const LazyGeoMap = lazy(() => import('./GeoMap').then((m) => ({ default: m.GeoMap })));

/** Leaflet loads only when a map is rendered; a same-size skeleton keeps the layout stable meanwhile. */
export const GeoMap: React.FC<GeoMapProps> = (props) => (
  <Suspense fallback={<div className={clsx('skeleton', props.className)} style={{ borderRadius: 18 }} aria-hidden="true" />}>
    <LazyGeoMap {...props} />
  </Suspense>
);
