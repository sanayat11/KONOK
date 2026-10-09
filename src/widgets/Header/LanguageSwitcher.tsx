import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LOCALES, useT } from '@/shared/i18n';
import { useDismiss } from './useDismiss';
import styles from './Header.module.scss';

/** Header dropdown; the choice applies instantly and persists (see shared/i18n/store). */
export const LanguageSwitcher: React.FC = () => {
  const { t, locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className={styles.dropdownWrapper} ref={ref}>
      <button
        type="button"
        className={styles.langButton}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('nav.languageMenu')}: ${current.native}`}
      >
        <Globe size={20} strokeWidth={1.6} />
        <span>{current.short}</span>
        <ChevronDown size={14} className={clsx(styles.chevron, open && styles.rotate)} />
      </button>
      {open && (
        <div className={clsx(styles.dropdownMenu, styles.langMenu)} role="menu">
          {LOCALES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitemradio"
              aria-checked={lang.code === locale}
              lang={lang.code}
              className={clsx(styles.dropdownItem, lang.code === locale && styles.itemActive)}
              onClick={() => {
                setLocale(lang.code);
                close();
              }}
            >
              <span className={styles.langCode}>{lang.short}</span>
              <span>{lang.native}</span>
              {lang.code === locale && <Check size={15} className={styles.itemCheck} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** Segmented variant for the mobile drawer and settings. */
export const LanguageSegmented: React.FC<{ className?: string }> = ({ className }) => {
  const { t, locale, setLocale } = useT();
  return (
    <div className={clsx(styles.segmented, className)} role="radiogroup" aria-label={t('nav.language')}>
      {LOCALES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          role="radio"
          aria-checked={lang.code === locale}
          lang={lang.code}
          className={clsx(styles.segment, lang.code === locale && styles.segmentActive)}
          onClick={() => setLocale(lang.code)}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
};
