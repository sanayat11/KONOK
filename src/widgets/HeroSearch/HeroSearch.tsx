import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronDown, MapPin, Search, Users } from 'lucide-react';
import clsx from 'clsx';
import styles from './HeroSearch.module.scss';

type SearchTab = 'tours' | 'stays' | 'transport';

const TABS: Array<{ id: SearchTab; label: string }> = [
  { id: 'tours', label: '1.Планирование маршрута' },
  { id: 'stays', label: '2. Поиск жилья' },
  { id: 'transport', label: '3. Транспорт' },
];

const CITIES = ['Бишкек', 'Ош', 'Каракол', 'Нарын', 'Чолпон-Ата', 'Баткен'];
const DESTINATIONS = ['Бишкек', 'Ысык-Көл', 'Сон-Көл', 'Таш-Рабат', 'Ала-Арча', 'Сары-Челек', 'Кёль-Суу'];
const DATES = ['Выберите даты', '12 окт – 18 окт', '20 окт – 25 окт', '1 ноя – 5 ноя', 'Любые даты'];
const GUESTS = ['1', '2', '3', '4', '5+'];

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

/** Figma field: white 60px box, icon, small grey label over the value, chevron. */
const Field: React.FC<FieldProps> = ({ icon, label, value, options, onChange, className }) => (
  <label className={clsx(styles.field, className)}>
    <span className={styles.fieldIcon}>{icon}</span>
    <span className={styles.fieldBody}>
      <span className={styles.fieldLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.fieldSelect}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
    <ChevronDown size={18} className={styles.fieldChevron} aria-hidden="true" />
  </label>
);

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchTab>('tours');
  const [fromLoc, setFromLoc] = useState('Бишкек');
  const [toLoc, setToLoc] = useState('Бишкек');
  const [dates, setDates] = useState(DATES[0]);
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'tours') navigate('/catalog/guides');
    else if (activeTab === 'stays') navigate('/catalog/places');
    else navigate('/catalog/cars');
  };

  return (
    <section className={styles.heroSection}>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85"
        alt="Озеро Сон-Көл, юрты и горы Тянь-Шаня"
        className={styles.bannerImage}
      />

      <div className={styles.searchContainer}>
        <div className={styles.searchCard}>
          <div className={styles.tabsRow} role="tablist" aria-label="Что ищем">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={clsx(styles.tabBtn, activeTab === tab.id && styles.tabActive)}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <Field icon={<MapPin size={26} />} label="Откуда?" value={fromLoc} options={CITIES} onChange={setFromLoc} />
            <Field icon={<MapPin size={26} />} label="Куда?" value={toLoc} options={DESTINATIONS} onChange={setToLoc} />
            <Field
              icon={<CalendarDays size={26} />}
              label="Дата"
              value={dates}
              options={DATES}
              onChange={setDates}
              className={styles.fieldWide}
            />
            <Field
              icon={<Users size={26} />}
              label="Гости"
              value={guests}
              options={GUESTS}
              onChange={setGuests}
              className={styles.fieldNarrow}
            />
            <button type="submit" className={styles.submitBtn} aria-label="Искать">
              <Search size={28} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
