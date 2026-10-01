import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import clsx from 'clsx';
import styles from './HeroSearch.module.scss';

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tours' | 'stays' | 'transport'>('tours');
  const [fromLoc, setFromLoc] = useState('Бишкек');
  const [toLoc, setToLoc] = useState('Ысык-Көл');
  const [dates, setDates] = useState('24 сен – 28 сен');
  const [guests, setGuests] = useState('2 гостя');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'tours') {
      navigate('/catalog/guides');
    } else if (activeTab === 'stays') {
      navigate('/catalog/places');
    } else {
      navigate('/catalog/cars');
    }
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroBanner}>
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85"
          alt="Кыргызстан — Юрты и Горы Тянь-Шаня"
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay} />

        {/* Floating Search Bar Container */}
        <div className={styles.searchContainer}>
          <div className={styles.searchCard}>
            {/* Category Switcher Tabs */}
            <div className={styles.tabsRow}>
              <button
                type="button"
                className={clsx(styles.tabBtn, activeTab === 'tours' && styles.tabActive)}
                onClick={() => setActiveTab('tours')}
              >
                1. Индивидуальные экскурсии
              </button>
              <button
                type="button"
                className={clsx(styles.tabBtn, activeTab === 'stays' && styles.tabActive)}
                onClick={() => setActiveTab('stays')}
              >
                2. Поиск жилья
              </button>
              <button
                type="button"
                className={clsx(styles.tabBtn, activeTab === 'transport' && styles.tabActive)}
                onClick={() => setActiveTab('transport')}
              >
                3. Транспорт
              </button>
            </div>

            {/* Inputs Form */}
            <form className={styles.searchForm} onSubmit={handleSearch}>
              {/* Field 1: Откуда */}
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Откуда?</span>
                <div className={styles.fieldInputGroup}>
                  <MapPin size={16} className={styles.fieldIcon} />
                  <select
                    value={fromLoc}
                    onChange={(e) => setFromLoc(e.target.value)}
                    className={styles.fieldSelect}
                  >
                    <option value="Бишкек">Бишкек</option>
                    <option value="Ош">Ош</option>
                    <option value="Каракол">Каракол</option>
                    <option value="Нарын">Нарын</option>
                    <option value="Чолпон-Ата">Чолпон-Ата</option>
                    <option value="Баткен">Баткен</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldDivider} />

              {/* Field 2: Куда */}
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Куда?</span>
                <div className={styles.fieldInputGroup}>
                  <MapPin size={16} className={styles.fieldIcon} />
                  <select
                    value={toLoc}
                    onChange={(e) => setToLoc(e.target.value)}
                    className={styles.fieldSelect}
                  >
                    <option value="Ысык-Көл">Ысык-Көл</option>
                    <option value="Сон-Көл">Сон-Көл</option>
                    <option value="Таш-Рабат">Таш-Рабат</option>
                    <option value="Ала-Арча">Ала-Арча</option>
                    <option value="Сары-Челек">Сары-Челек</option>
                    <option value="Кёль-Суу">Кёль-Суу</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldDivider} />

              {/* Field 3: Дата */}
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Дата</span>
                <div className={styles.fieldInputGroup}>
                  <Calendar size={16} className={styles.fieldIcon} />
                  <select
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className={styles.fieldSelect}
                  >
                    <option value="24 сен – 28 сен">24 сен – 28 сен</option>
                    <option value="1 окт – 5 окт">1 окт – 5 окт</option>
                    <option value="10 окт – 15 окт">10 окт – 15 окт</option>
                    <option value="Любые даты">Любые даты</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldDivider} />

              {/* Field 4: Гости */}
              <div className={styles.fieldItem}>
                <span className={styles.fieldLabel}>Гости</span>
                <div className={styles.fieldInputGroup}>
                  <Users size={16} className={styles.fieldIcon} />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={styles.fieldSelect}
                  >
                    <option value="1 гость">1 гость</option>
                    <option value="2 гостя">2 гостя</option>
                    <option value="3-4 гостя">3-4 гостя</option>
                    <option value="5+ гостей">5+ гостей</option>
                  </select>
                </div>
              </div>

              {/* Search Submit Button */}
              <button type="submit" className={styles.submitBtn} aria-label="Искать">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
