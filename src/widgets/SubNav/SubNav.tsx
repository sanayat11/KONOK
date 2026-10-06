import React, { useState } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import styles from './SubNav.module.scss';

const SECTIONS = [
  { to: '/', label: 'Главная', match: (path: string) => path === '/' },
  { to: '/catalog/guides', label: 'Жители', match: (path: string) => /^\/(catalog\/guides|guides)/.test(path) },
  { to: '/catalog/places', label: 'Места', match: (path: string) => /^\/(catalog\/places|places)/.test(path) },
  { to: '/catalog/cars', label: 'Транспорт', match: (path: string) => /^\/(catalog\/cars|cars)/.test(path) },
];

/** Catalog-specific checkbox filter shown left of the search box (Figma: "гид", "с водителем"). */
const FILTERS: Record<string, { param: string; label: string }> = {
  '/catalog/guides': { param: 'guide', label: 'гид' },
  '/catalog/cars': { param: 'driver', label: 'с водителем' },
};

/** Filter checkbox + search box for a catalog page; keyed by route so each catalog starts fresh. */
const CatalogTools: React.FC<{ pathname: string }> = ({ pathname }) => {
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
          <span>{filter.label}</span>
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
          placeholder="Поиск"
          aria-label="Поиск"
        />
        <button type="submit" aria-label="Искать">
          <Search size={22} />
        </button>
      </form>
    </div>
  );
};

/**
 * White section bar under the header (Figma: 85px, pills 152×37).
 * On catalog pages it also hosts the search box and filter; both live in the
 * URL query (`?q=`, `?guide=1`, `?driver=1`) so the catalog page can read them.
 */
export const SubNav: React.FC = () => {
  const { pathname } = useLocation();
  const isCatalog = pathname.startsWith('/catalog/');

  return (
    <nav className={styles.bar} aria-label="Разделы">
      <div className={styles.container}>
        <div className={styles.pills}>
          {SECTIONS.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              className={clsx(styles.pill, section.match(pathname) && styles.active)}
              aria-current={section.match(pathname) ? 'page' : undefined}
            >
              {section.label}
            </NavLink>
          ))}
        </div>

        {isCatalog && <CatalogTools key={pathname} pathname={pathname} />}
      </div>
    </nav>
  );
};
