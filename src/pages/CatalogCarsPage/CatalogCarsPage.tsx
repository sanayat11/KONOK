import React, { useState, useMemo } from 'react';
import { Search, Filter, Car as CarIcon } from 'lucide-react';
import { Tabs } from '@/shared/ui/Tabs';
import { CarCard } from '@/entities/car/ui/CarCard';
import { mockCars } from '@/shared/api/mocks/cars';
import styles from './CatalogCarsPage.module.scss';

export const CatalogCarsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredCars = useMemo(() => {
    return mockCars.filter((car) => {
      const matchSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion =
        selectedRegion === 'all' || car.regionId === selectedRegion;

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
                <option value="chuy">Бишкек / Чуй</option>
                <option value="issyk-kul">Ысык-Көл</option>
                <option value="naryn">Нарын</option>
                <option value="osh">Ош</option>
              </select>
            </div>

            {/* Search input */}
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Поиск по авто и классу..."
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
            Доступно автомобилей: <strong>{filteredCars.length}</strong>
          </span>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className={styles.grid}>
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <CarIcon size={40} className={styles.emptyIcon} />
            <h3>Автомобили не найдены</h3>
            <p>Попробуйте выбрать другой регион или изменить параметры фильтра.</p>
          </div>
        )}
      </div>
    </div>
  );
};
