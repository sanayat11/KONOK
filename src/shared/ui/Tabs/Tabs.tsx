import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Tabs.module.scss';

export interface TabItem {
  key: string;
  label: string;
  path: string;
}

export const MAIN_NAV_TABS: TabItem[] = [
  { key: 'home', label: 'Главная', path: '/' },
  { key: 'guides', label: 'Жители', path: '/catalog/guides' },
  { key: 'places', label: 'Места', path: '/catalog/places' },
  { key: 'cars', label: 'Транспорт', path: '/catalog/cars' },
];

export interface TabsProps {
  tabs?: TabItem[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs = MAIN_NAV_TABS,
  className,
}) => {
  const location = useLocation();

  return (
    <nav className={clsx(styles.tabsContainer, className)} aria-label="Разделы KONOK">
      {tabs.map((tab) => {
        const isActive =
          tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path);

        return (
          <NavLink
            key={tab.key}
            to={tab.path}
            className={clsx(styles.tabItem, isActive && styles.active)}
          >
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
};
