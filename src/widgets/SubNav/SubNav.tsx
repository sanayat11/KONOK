import React, { useState } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useT, type TranslationKey } from '@/shared/i18n';
import styles from './SubNav.module.scss';

export type CatalogKind = 'stays' | 'guides' | 'places' | 'cars';

const SECTIONS: Array<{ to: string; label: TranslationKey; match: (path: string) => boolean }> = [
  { to: '/', label: 'nav.home', match: (path) => path === '/' },
  { to: '/catalog/stays', label: 'nav.stays', match: (path) => /^\/(catalog\/stays|stays)/.test(path) },
  { to: '/catalog/guides', label: 'nav.residents', match: (path) => /^\/(catalog\/guides|guides)/.test(path) },
  { to: '/catalog/places', label: 'nav.places', match: (path) => /^\/(catalog\/places|places)/.test(path) },
  { to: '/catalog/cars', label: 'nav.transport', match: (path) => /^\/(catalog\/cars|cars)/.test(path) },
];

/** Catalog-specific checkbox filter shown left of the search box (Figma: "гид", "с водителем"). */
const FILTERS: Record<string, { param: string; label: TranslationKey }> = {
  '/catalog/guides': { param: 'guide', label: 'catalog.filterGuide' },
  '/catalog/cars': { param: 'driver', label: 'catalog.filterDriver' },
};

/** Filter checkbox + search box for a catalog page; keyed by route so each catalog starts fresh. */
const CatalogTools: React.FC<{ pathname: string }> = ({ pathname }) => {
  const { t } = useT();
  const [params, setParams] = useSearchParams();
  const filter = FILTERS[pathname];
  const [query, setQuery] = useState(params.get('q') ?? '');

  const updateParam = (key: string, value: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className={styles.tools}>
      {filter && (
        <label className={styles.filter}>
          <input
            type="checkbox"
            checked={params.get(filter.param) === '1'}
            onChange={(e) => updateParam(filter.param, e.target.checked ? '1' : null)}
          />
          <span>{t(filter.label)}</span>
        </label>
      )}
      <form
        className={styles.search}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          updateParam('q', query.trim() || null);
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateParam('q', e.target.value.trim() || null);
          }}
          placeholder={t('common.search')}
          aria-label={t('catalog.searchLabel')}
        />
        <button type="submit" aria-label={t('common.searchAction')}>
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

/**
 * White section bar under the header (Figma: pills + catalog search).
 * Search and filter live in the URL query (`?q=`, `?guide=1`, `?driver=1`) so the catalog page can read them.
 */
export const SubNav: React.FC = () => {
  const { t } = useT();
  const { pathname } = useLocation();
  const isCatalog = pathname.startsWith('/catalog/');

  return (
    <nav className={styles.bar} aria-label={t('nav.main')}>
      <div className={styles.container}>
        <div className={styles.pills}>
          {SECTIONS.map((section) => {
            const active = section.match(pathname);
            return (
              <NavLink
                key={section.to}
                to={section.to}
                className={clsx(styles.pill, active && styles.active)}
                aria-current={active ? 'page' : undefined}
              >
                {t(section.label)}
              </NavLink>
            );
          })}
        </div>

        {isCatalog && <CatalogTools key={pathname} pathname={pathname} />}
      </div>
    </nav>
  );
};
