import React, { useState, useMemo } from 'react';
import { Search, Filter, Compass } from 'lucide-react';
import { Tabs } from '@/shared/ui/Tabs';
import { PlaceCard } from '@/entities/place/ui/PlaceCard';
import { mockPlaces } from '@/shared/api/mocks/places';
import styles from './CatalogPlacesPage.module.scss';

export const CatalogPlacesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion =
        selectedRegion === 'all' || place.regionId === selectedRegion;

      return matchSearch && matchRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Top Filter and Navigation Header */}
        <div className={styles.topBar}>
          <Tabs />

          <div className={styles.filtersGroup}>
            {/* Region select */}
            <div className={styles.regionSelectWrap}>
              <Filter size={16} className={styles.filterIcon} />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={styles.regionSelect}
              >
                <option value="all">Все регионы</option>
                <option value="issyk-kul">Ысык-Көл</option>
                <option value="naryn">Нарын</option>
                <option value="osh">Ош</option>
                <option value="chuy">Чуй</option>
                <option value="jalal-abad">Жалал-Абад</option>
                <option value="batken">Баткен</option>
                <option value="talas">Талас</option>
              </select>
            </div>

            {/* Search input */}
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Поиск по местам и озерам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <Search size={18} className={styles.searchIcon} />
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className={styles.counterRow}>
          <span className={styles.counterText}>
            Достопримечательностей найдено: <strong>{filteredPlaces.length}</strong>
          </span>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className={styles.grid}>
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Compass size={40} className={styles.emptyIcon} />
            <h3>Места не найдены</h3>
            <p>Попробуйте выбрать другой регион или изменить поисковый запрос.</p>
          </div>
        )}
      </div>
    </div>
  );
};
