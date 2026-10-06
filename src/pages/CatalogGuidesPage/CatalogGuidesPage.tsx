import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Tabs } from '@/shared/ui/Tabs';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { mockGuides } from '@/shared/api/mocks/guides';
import styles from './CatalogGuidesPage.module.scss';

export const CatalogGuidesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [onlySuperhost, setOnlySuperhost] = useState(false);

  const filteredGuides = useMemo(() => {
    return mockGuides.filter((guide) => {
      const matchSearch =
        guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion =
        selectedRegion === 'all' || guide.regionId === selectedRegion;

      const matchSuperhost = !onlySuperhost || guide.isSuperhost;

      return matchSearch && matchRegion && matchSuperhost;
    });
  }, [searchQuery, selectedRegion, onlySuperhost]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Top Filter and Navigation Header */}
        <div className={styles.topBar}>
          <Tabs />

          <div className={styles.filtersGroup}>
            {/* Guide checkbox */}
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={onlySuperhost}
                onChange={(e) => setOnlySuperhost(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Супергид</span>
            </label>

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
                placeholder="Поиск по имени или региону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <Search size={18} className={styles.searchIcon} />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className={styles.counterRow}>
          <span className={styles.counterText}>
            Найдено жителей: <strong>{filteredGuides.length}</strong>
          </span>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className={styles.grid}>
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <SlidersHorizontal size={40} className={styles.emptyIcon} />
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
          </div>
        )}
      </div>
    </div>
  );
};
