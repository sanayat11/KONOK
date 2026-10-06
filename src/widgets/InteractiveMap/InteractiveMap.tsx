import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Maximize2, ExternalLink, Users } from 'lucide-react';
import clsx from 'clsx';
import { MapBackdrop } from '@/shared/ui/MapBackdrop';
import styles from './InteractiveMap.module.scss';

interface MapPoint {
  id: string;
  name: string;
  count: number;
  top: number; // percentage
  left: number; // percentage
  color: 'gold' | 'blue' | 'accent';
  regionId: string;
  category: string;
  desc: string;
}

const MAP_POINTS: MapPoint[] = [
  {
    id: 'pt-bishkek',
    name: 'Бишкек и Чуйская долина',
    count: 291,
    top: 26,
    left: 45,
    color: 'gold',
    regionId: 'chuy',
    category: 'Столица • Ала-Арча • Бурана',
    desc: '291 предложение: городские гиды, трансферы и горные трекинг-маршруты',
  },
  {
    id: 'pt-issyk-kul-main',
    name: 'Озеро Ысык - Көл',
    count: 14,
    top: 36,
    left: 72,
    color: 'gold',
    regionId: 'issyk-kul',
    category: 'Жемчужина Тянь-Шаня',
    desc: 'Пляжи, каньоны, горячие источники Алтын-Арашан и этно-юрты',
  },
  {
    id: 'pt-issyk-kul-east',
    name: 'Каракол и Хан-Тенгри',
    count: 5,
    top: 33,
    left: 85,
    color: 'gold',
    regionId: 'issyk-kul',
    category: 'Альпинизм и трекинг',
    desc: 'Пешие походы на Ала-Кёль и высотные экспедиции',
  },
  {
    id: 'pt-naryn',
    name: 'Нарын и Таш-Рабат',
    count: 8,
    top: 55,
    left: 58,
    color: 'gold',
    regionId: 'naryn',
    category: 'Караван-сарай • Кёль-Суу',
    desc: 'Суровые горы, конные переходы и ночевки под звездами',
  },
  {
    id: 'pt-son-kul',
    name: 'Озеро Сон - Көл',
    count: 3,
    top: 48,
    left: 49,
    color: 'gold',
    regionId: 'naryn',
    category: 'Высокогорное жайлоо (3016 м)',
    desc: 'Традиционные юрты, кумыс и табуны лошадей',
  },
  {
    id: 'pt-osh',
    name: 'Ош и Сулайман-Тоо',
    count: 42,
    top: 76,
    left: 32,
    color: 'gold',
    regionId: 'osh',
    category: '3000-летняя южная столица',
    desc: 'Священная гора ЮНЕСКО, колоритные восточные базары',
  },
  {
    id: 'pt-alay',
    name: 'Алайская долина и Памир',
    count: 4,
    top: 86,
    left: 36,
    color: 'gold',
    regionId: 'osh',
    category: 'Базовый лагерь пика Ленина',
    desc: 'Памирский тракт и марсианские долины Сары-Таш',
  },
  {
    id: 'pt-jalal-abad',
    name: 'Сары-Челек и Арсланбоб',
    count: 2,
    top: 42,
    left: 30,
    color: 'gold',
    regionId: 'jalal-abad',
    category: 'Реликтовые ореховые леса',
    desc: 'Биосферный заповедник Сары-Челек и каскады водопадов',
  },
  {
    id: 'pt-batken',
    name: 'Баткен и Каравшин',
    count: 3,
    top: 82,
    left: 17,
    color: 'gold',
    regionId: 'batken',
    category: 'Цветок Айгуль • Каравшин',
    desc: 'Азиатская Патагония с гранитными пиками для скалолазов',
  },
];

export const InteractiveMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(MAP_POINTS[0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className={styles.mapWidget}>
      {/* Map Canvas with Topographic Relief Background */}
      <div
        className={styles.mapCanvas}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* SVG Topographic map illustration / relief background */}
        <div className={styles.mapGraphic}>
          <MapBackdrop className={styles.svgMap} />
        </div>

        {/* Interactive Cluster Pin Badges */}
        {MAP_POINTS.map((pt) => {
          const isSelected = selectedPoint?.id === pt.id;
          return (
            <button
              key={pt.id}
              type="button"
              className={clsx(
                styles.mapPin,
                styles[pt.color],
                isSelected && styles.selected
              )}
              style={
                {
                  top: `${pt.top}%`,
                  left: `${pt.left}%`,
                  // Bigger clusters get bigger bubbles, as on the Figma map.
                  '--pin-size': `${Math.round(Math.min(36 + Math.log10(pt.count + 1) * 18, 80))}px`,
                } as React.CSSProperties
              }
              onClick={() => setSelectedPoint(pt)}
              title={pt.name}
            >
              <span className={styles.pinNumber}>{pt.count}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Point Popover / Details Bottom Card */}
      {selectedPoint && (
        <div className={styles.pointDetailCard}>
          <div className={styles.pointHeader}>
            <div>
              <span className={styles.pointTag}>{selectedPoint.category}</span>
              <h4 className={styles.pointTitle}>{selectedPoint.name}</h4>
            </div>
            <button
              className={styles.closeCardBtn}
              onClick={() => setSelectedPoint(null)}
            >
              ✕
            </button>
          </div>
          <p className={styles.pointDesc}>{selectedPoint.desc}</p>
          <div className={styles.pointActions}>
            <button
              className={styles.viewGuidesBtn}
              onClick={() => navigate('/catalog/guides')}
            >
              <Users size={15} />
              <span>Посмотреть жителей ({selectedPoint.count})</span>
            </button>
            <button
              className={styles.viewPlacesBtn}
              onClick={() => navigate('/catalog/places')}
            >
              <ExternalLink size={15} />
              <span>Достопримечательности</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className={styles.mapControls}>
        <button
          className={styles.ctrlBtn}
          onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.45))}
          title="Приблизить"
        >
          <Plus size={18} />
        </button>
        <button
          className={styles.ctrlBtn}
          onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
          title="Отдалить"
        >
          <Minus size={18} />
        </button>
        <button
          className={styles.ctrlBtn}
          onClick={() => setZoomLevel(1)}
          title="Сбросить масштаб"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};
