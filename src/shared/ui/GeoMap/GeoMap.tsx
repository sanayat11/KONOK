import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';
import { Maximize2, Minus, Plus } from 'lucide-react';
import { useT } from '@/shared/i18n';
import styles from './GeoMap.module.scss';

/** Kyrgyzstan with a small margin. */
const KG_BOUNDS = L.latLngBounds([39.15, 69.25], [43.3, 80.3]);
const MAX_BOUNDS = KG_BOUNDS.pad(0.35);

// Esri World Topographic Map: real borders, relief, roads and place names; no API key required.
const TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
const ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> — Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors, and the GIS User Community';

export interface GeoMarker {
  id: string;
  lat: number;
  lng: number;
  /** Accessible name / tooltip. */
  label: string;
  /** Cluster count shown inside the bubble (`cluster` markers). */
  count?: number;
  active?: boolean;
}

export interface GeoMapProps {
  markers: GeoMarker[];
  variant?: 'cluster' | 'pin';
  activeId?: string | null;
  onSelect?: (id: string) => void;
  /** Zoom to the active marker when it changes. */
  focusActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const markerHtml = (marker: GeoMarker, variant: 'cluster' | 'pin') => {
  if (variant === 'cluster') {
    const size = Math.round(30 + Math.min(marker.count ?? 0, 12) * 1.6);
    return {
      html: `<span class="konok-cluster${marker.active ? ' is-active' : ''}" style="--size:${size}px"><span>${marker.count ?? ''}</span></span>`,
      size,
    };
  }
  return {
    html: `<span class="konok-pin${marker.active ? ' is-active' : ''}"><svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 31s10-10.2 10-18.5A10 10 0 0 0 2 12.5C2 20.8 12 31 12 31z"/><circle cx="12" cy="12.5" r="4"/></svg></span>`,
    size: 32,
  };
};

/** Interactive topographic map of Kyrgyzstan with branded markers. */
export const GeoMap: React.FC<GeoMapProps> = ({
  markers,
  variant = 'pin',
  activeId = null,
  onSelect,
  focusActive = false,
  className,
  children,
}) => {
  const { t } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 0.8,
      minZoom: 5,
      maxZoom: 13,
      zoomSnap: 0.25,
      fadeAnimation: true,
    });
    map.attributionControl.setPrefix(false);
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 13, detectRetina: true }).addTo(map);
    map.fitBounds(KG_BOUNDS, { padding: [12, 12] });

    // Wheel zoom only after the visitor engages with the map — no scroll hijacking.
    const enableWheel = () => map.scrollWheelZoom.enable();
    const disableWheel = () => map.scrollWheelZoom.disable();
    map.on('click focus', enableWheel);
    map.on('mouseout blur', disableWheel);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Keep tiles aligned when the container resizes (responsive layouts, reveals).
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  const markerRefs = useRef(new Map<string, L.Marker>());

  // Sync markers (only when the set of markers changes).
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markerRefs.current.clear();
    for (const marker of markers) {
      const { html, size } = markerHtml(marker, variant);
      const icon = L.divIcon({
        html,
        className: 'konok-marker',
        iconSize: [size, size],
        iconAnchor: variant === 'pin' ? [size / 2, size] : [size / 2, size / 2],
      });
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon,
        title: marker.label,
        alt: marker.label,
        keyboard: true,
        riseOnHover: true,
      })
        .on('click', () => onSelectRef.current?.(marker.id))
        .on('keypress', (e: L.LeafletKeyboardEvent) => {
          if (e.originalEvent.key === 'Enter') onSelectRef.current?.(marker.id);
        })
        .addTo(layer);
      markerRefs.current.set(marker.id, leafletMarker);
    }
  }, [markers, variant]);

  // Highlight the active marker in place (no re-creation, so no replayed entrance animation).
  useEffect(() => {
    markerRefs.current.forEach((leafletMarker, id) => {
      const isActive = id === activeId;
      leafletMarker.setZIndexOffset(isActive ? 1000 : 0);
      leafletMarker.getElement()?.firstElementChild?.classList.toggle('is-active', isActive);
      leafletMarker.getElement()?.setAttribute('aria-pressed', String(isActive));
    });
  }, [activeId, markers, variant]);

  // Focus the active marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusActive || !activeId) return;
    const target = markers.find((m) => m.id === activeId);
    if (!target) return;
    const zoom = Math.max(map.getZoom(), 7.5);
    if (prefersReducedMotion()) map.setView([target.lat, target.lng], zoom);
    else map.flyTo([target.lat, target.lng], zoom, { duration: 1.1, easeLinearity: 0.2 });
  }, [activeId, focusActive, markers]);

  const reset = () => {
    const map = mapRef.current;
    if (map) map.flyToBounds(KG_BOUNDS, { padding: [12, 12], duration: prefersReducedMotion() ? 0 : 0.9 });
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div ref={containerRef} className={styles.map} role="region" aria-label={t('map.label')} />

      <div className={styles.controls}>
        <button type="button" className={styles.ctrlBtn} onClick={() => mapRef.current?.zoomIn()} aria-label={t('map.zoomIn')} title={t('map.zoomIn')}>
          <Plus size={16} />
        </button>
        <button type="button" className={styles.ctrlBtn} onClick={() => mapRef.current?.zoomOut()} aria-label={t('map.zoomOut')} title={t('map.zoomOut')}>
          <Minus size={16} />
        </button>
        <button type="button" className={styles.ctrlBtn} onClick={reset} aria-label={t('map.reset')} title={t('map.reset')}>
          <Maximize2 size={14} />
        </button>
      </div>

      {children}
    </div>
  );
};
