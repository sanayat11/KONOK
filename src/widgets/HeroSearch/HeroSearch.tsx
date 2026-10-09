import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BedDouble, CalendarDays, Car, MapPin, Search, Users, UsersRound } from 'lucide-react';
import clsx from 'clsx';
import type { RegionId } from '@/entities/types';
import { useCatalogStays } from '@/entities/stay';
import { mockGuides } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { DAY_MS, toInputDate, useToday } from '@/shared/lib/date';
import { HERO_IMAGE } from '@/shared/lib/images';
import styles from './HeroSearch.module.scss';

type SearchTab = 'stays' | 'residents' | 'transport';
const TABS: SearchTab[] = ['stays', 'residents', 'transport'];

const TAB_ROUTES: Record<SearchTab, string> = {
  stays: '/catalog/stays',
  residents: '/catalog/guides',
  transport: '/catalog/cars',
};

const TAB_ICONS: Record<SearchTab, React.ReactNode> = {
  stays: <BedDouble size={17} strokeWidth={2} />,
  residents: <UsersRound size={17} strokeWidth={2} />,
  transport: <Car size={17} strokeWidth={2} />,
};

/** Every option maps onto a catalog region (`?region=`) — the only location filter the catalogs have. */
const REGIONS: Array<RegionId | ''> = ['', 'issyk-kul', 'naryn', 'chuy', 'osh', 'jalal-abad', 'talas', 'batken', 'bishkek'];
const MAX_GUESTS = 12;

/**
 * Home hero: the brief's photo, a clear value proposition and a search wired to the real catalog
 * filters — region for every tab, plus dates and guests for stays (used for capacity, nightly totals
 * and to prefill the booking form).
 */
export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const { t, locale } = useT();
  const today = useToday();
  const stays = useCatalogStays();
  const [tab, setTab] = useState<SearchTab>('stays');
  const [region, setRegion] = useState<RegionId | ''>('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [dateError, setDateError] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const activeIndex = TABS.indexOf(tab);

  useLayoutEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeIndex];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeIndex, locale]);

  const todayIso = toInputDate(today);
  const minCheckOut = checkIn ? toInputDate(new Date(new Date(checkIn).getTime() + DAY_MS)) : todayIso;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (tab === 'stays') {
      // Dates are optional, but half a range or a reversed one is a mistake worth pointing out.
      if (Boolean(checkIn) !== Boolean(checkOut) || (checkIn && checkOut && checkOut <= checkIn)) {
        setDateError(true);
        return;
      }
      if (checkIn && checkOut) {
        params.set('checkIn', checkIn);
        params.set('checkOut', checkOut);
      }
      params.set('guests', String(guests));
    }
    const query = params.toString();
    navigate(query ? `${TAB_ROUTES[tab]}?${query}` : TAB_ROUTES[tab]);
  };

  const regionField = (
    <label className={clsx(styles.field, styles.fieldWide)}>
      <span className={styles.fieldLabel}>
        <MapPin size={15} aria-hidden="true" />
        {tab === 'transport' ? t('search.pickupRegion') : t('search.to')}
      </span>
      <select value={region} onChange={(e) => setRegion(e.target.value as RegionId | '')} className={styles.control}>
        {REGIONS.map((r) => (
          <option key={r || 'any'} value={r}>
            {r ? t(`regions.${r}.name`) : t('search.destinations.anywhere')}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <img
          src={HERO_IMAGE.src}
          srcSet={HERO_IMAGE.srcSet}
          sizes="100vw"
          alt=""
          className={styles.image}
          fetchPriority="high"
          onError={(e) => {
            // Keep the hero readable even if the photo can't load: the green backdrop remains.
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        <div className={styles.shade} />
        <div className={styles.glow} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
          {/* The visual headline was dropped for a calmer hero; the h1 stays for screen readers and search. */}
          <h1 id="hero-title" className="visually-hidden">
            {t('hero.titleStart')} {t('hero.titleAccent')}
          </h1>
          <p className={styles.lead}>{t('hero.lead')}</p>
          <div className={styles.ctas}>
            <Link to="/catalog/stays" className={styles.primaryCta}>
              {t('hero.ctaStays')}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/auth?role=host" className={styles.secondaryCta}>
              {t('hero.ctaHost')}
            </Link>
          </div>
          <ul className={styles.facts}>
            <li>
              <strong>{stays.length}</strong> {t('hero.factStays', { count: stays.length })}
            </li>
            <li>
              <strong>{mockGuides.length}</strong> {t('hero.factResidents', { count: mockGuides.length })}
            </li>
          </ul>
        </div>

        <div className={styles.panel}>
          <div className={styles.tabs} role="tablist" aria-label={t('search.tabsLabel')}>
            <span
              className={styles.indicator}
              style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width || undefined }}
              aria-hidden="true"
            />
            {TABS.map((id, index) => (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`hero-tab-${id}`}
                aria-selected={tab === id}
                aria-controls="hero-search"
                className={clsx(styles.tab, tab === id && styles.tabActive)}
                onClick={() => {
                  setTab(id);
                  setDateError(false);
                }}
              >
                {TAB_ICONS[id]}
                <span>{t(`search.tabs.${id}`)}</span>
              </button>
            ))}
          </div>

          <form
            id="hero-search"
            role="tabpanel"
            aria-labelledby={`hero-tab-${tab}`}
            className={clsx(styles.form, tab !== 'stays' && styles.formCompact)}
            onSubmit={submit}
            noValidate
          >
            {regionField}

            {tab === 'stays' && (
              <>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    <CalendarDays size={15} aria-hidden="true" />
                    {t('booking.checkIn')}
                  </span>
                  <input
                    type="date"
                    className={styles.control}
                    value={checkIn}
                    min={todayIso}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setDateError(false);
                      if (checkOut && e.target.value >= checkOut) setCheckOut('');
                    }}
                    aria-invalid={dateError}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    <CalendarDays size={15} aria-hidden="true" />
                    {t('booking.checkOut')}
                  </span>
                  <input
                    type="date"
                    className={styles.control}
                    value={checkOut}
                    min={minCheckOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setDateError(false);
                    }}
                    aria-invalid={dateError}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    <Users size={15} aria-hidden="true" />
                    {t('search.guests')}
                  </span>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={styles.control}>
                    {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {t('common.guests', { count: n })}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <button type="submit" className={styles.submit}>
              <Search size={19} strokeWidth={2.4} aria-hidden="true" />
              <span>{t('search.submit')}</span>
            </button>

            {dateError && (
              <p className={styles.formError} role="alert">
                {t('hero.dateError')}
              </p>
            )}
          </form>
          <p className={styles.panelNote}>{t(`hero.notes.${tab}`)}</p>
        </div>
      </div>

      <p className={styles.credit}>{t('hero.photoCredit')}</p>
    </section>
  );
};
