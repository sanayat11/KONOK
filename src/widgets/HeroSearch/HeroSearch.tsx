import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronDown,
  Compass,
  BedDouble,
  Car,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import clsx from 'clsx';
import type { RegionId } from '@/entities/types';
import { useT, type TranslationKey } from '@/shared/i18n';
import { IMAGES } from '@/shared/lib/images';
import styles from './HeroSearch.module.scss';

type SearchTab = 'tours' | 'stays' | 'transport';

const TABS: SearchTab[] = ['tours', 'stays', 'transport'];

const TAB_ROUTES: Record<SearchTab, string> = {
  tours: '/catalog/guides',
  stays: '/catalog/places',
  transport: '/catalog/cars',
};

const TAB_ICONS: Record<SearchTab, React.ReactNode> = {
  tours: <Compass size={18} strokeWidth={2} />,
  stays: <BedDouble size={18} strokeWidth={2} />,
  transport: <Car size={18} strokeWidth={2} />,
};



const CITIES = ['bishkek', 'osh', 'karakol', 'naryn', 'cholponAta', 'batken'] as const;

/** Destinations map onto catalog regions (`?region=`). */
const DESTINATIONS: Array<{ id: string; region: RegionId | null }> = [
  { id: 'anywhere', region: null },
  { id: 'issykKul', region: 'issyk-kul' },
  { id: 'sonKul', region: 'naryn' },
  { id: 'tashRabat', region: 'naryn' },
  { id: 'alaArcha', region: 'chuy' },
  { id: 'saryChelek', region: 'jalal-abad' },
  { id: 'osh', region: 'osh' },
];

/** Transport is searched by pickup city. */
const CITY_REGION: Record<(typeof CITIES)[number], RegionId> = {
  bishkek: 'chuy',
  osh: 'osh',
  karakol: 'issyk-kul',
  naryn: 'naryn',
  cholponAta: 'issyk-kul',
  batken: 'batken',
};

const DATES = ['any', 'weekend', 'nextWeek', 'nextMonth'] as const;
const GUESTS = [1, 2, 3, 4, 5, 6];

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
}

/** Luxury field segment — native <select> covers the entire cell so clicks always open the dropdown. */
const Field: React.FC<FieldProps> = ({ icon, label, value, options, onChange, className }) => {
  const displayLabel = options.find((o) => o.value === value)?.label ?? value;
  return (
    <div className={clsx(styles.field, className)}>
      <span className={styles.fieldIcon}>{icon}</span>
      <span className={styles.fieldBody}>
        <span className={styles.fieldLabel}>{label}</span>
        <span className={styles.fieldValue}>{displayLabel}</span>
      </span>
      <ChevronDown size={16} className={styles.fieldChevron} aria-hidden="true" />
      {/* Native select stretched over the whole field for reliable click target */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.fieldSelect}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Modern Kyrgyz ethno luxury HeroSearch:
 * Floating frosted-glass tab switcher with sliding active indicator pill,
 * paired with a unified glassmorphism search capsule bar.
 */
export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const { t, locale } = useT();
  const [activeTab, setActiveTab] = useState<SearchTab>('tours');
  const [from, setFrom] = useState<string>('bishkek');
  const [to, setTo] = useState('anywhere');
  const [dates, setDates] = useState<string>('any');
  const [guests, setGuests] = useState('2');

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const activeIndex = TABS.indexOf(activeTab);

  // Position animated sliding indicator pill behind the active tab
  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab) {
      setIndicatorStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab, locale, activeIndex]);

  useEffect(() => {
    const updateIndicator = () => {
      const currentTab = tabRefs.current[activeIndex];
      if (currentTab) {
        setIndicatorStyle({
          left: currentTab.offsetLeft,
          width: currentTab.offsetWidth,
        });
      }
    };
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const region =
      activeTab === 'transport'
        ? CITY_REGION[from as (typeof CITIES)[number]]
        : DESTINATIONS.find((d) => d.id === to)?.region;
    navigate(region ? `${TAB_ROUTES[activeTab]}?region=${region}` : TAB_ROUTES[activeTab]);
  };



  return (
    <section className={styles.heroSection}>
      <img src={IMAGES.hero} alt={t('home.heroImageAlt')} className={styles.bannerImage} fetchPriority="high" />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.searchContainer}>
        {/* Floating pill navigation header with animated sliding indicator */}
        <div className={styles.headerBlock}>
          <div className={styles.tabsNav} role="tablist" aria-label={t('search.tabsLabel')}>
            {/* Smooth animated sliding background pill */}
            <div
              className={styles.tabIndicator}
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: indicatorStyle.width > 0 ? `${indicatorStyle.width}px` : undefined,
              }}
              aria-hidden="true"
            />

            {TABS.map((tab, index) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={clsx(styles.tabBtn, isActive && styles.tabActive)}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className={styles.tabIcon}>{TAB_ICONS[tab]}</span>
                  <span className={styles.tabIndex}>{index + 1}.</span>
                  <span className={styles.tabText}>{t(`search.tabs.${tab}`)}</span>
                </button>
              );
            })}
          </div>


        </div>

        {/* Unified luxury glassmorphism search capsule */}
        <form className={styles.searchBar} onSubmit={handleSearch} aria-label={t('search.label')}>
          <Field
            icon={<MapPin size={20} strokeWidth={1.8} />}
            label={t('search.from')}
            value={from}
            options={CITIES.map((c) => ({ value: c, label: t(`search.cities.${c}`) }))}
            onChange={setFrom}
            className={styles.fieldFrom}
          />

          <div className={styles.fieldDivider} aria-hidden="true" />

          <Field
            icon={<MapPin size={20} strokeWidth={1.8} />}
            label={t('search.to')}
            value={to}
            options={DESTINATIONS.map((d) => ({
              value: d.id,
              label: t(`search.destinations.${d.id}` as TranslationKey),
            }))}
            onChange={setTo}
            className={styles.fieldTo}
          />

          <div className={styles.fieldDivider} aria-hidden="true" />

          <Field
            icon={<CalendarDays size={20} strokeWidth={1.8} />}
            label={t('search.when')}
            value={dates}
            options={DATES.map((d) => ({ value: d, label: t(`search.dates.${d}`) }))}
            onChange={setDates}
            className={styles.fieldDates}
          />

          <div className={styles.fieldDivider} aria-hidden="true" />

          <Field
            icon={<Users size={20} strokeWidth={1.8} />}
            label={t('search.guests')}
            value={guests}
            options={GUESTS.map((g) => ({ value: String(g), label: t('common.guests', { count: g }) }))}
            onChange={setGuests}
            className={styles.fieldGuests}
          />

          <button type="submit" className={styles.submitBtn} aria-label={t('search.submit')}>
            <span className={styles.btnShimmer} aria-hidden="true" />
            <Search size={20} strokeWidth={2.4} className={styles.searchIcon} />
            <span className={styles.submitText}>{t('search.submit')}</span>
          </button>
        </form>
      </div>
    </section>
  );
};
