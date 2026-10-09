import { create } from 'zustand';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './types';

const STORAGE_KEY = 'konok_locale';

const isLocale = (value: unknown): value is Locale => LOCALES.some((l) => l.code === value);

/** Saved choice → browser language → Russian. */
const detectLocale = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // storage unavailable
  }
  for (const lang of navigator.languages ?? [navigator.language]) {
    const base = lang.toLowerCase().split('-')[0];
    if (base === 'ky' || base === 'kir') return 'ky';
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
};

const applyDocumentLang = (locale: Locale) => {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
};

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => {
  const initial = detectLocale();
  applyDocumentLang(initial);

  return {
    locale: initial,
    setLocale: (locale) => {
      try {
        localStorage.setItem(STORAGE_KEY, locale);
      } catch {
        // storage unavailable: the choice lasts for this session
      }
      applyDocumentLang(locale);
      set({ locale });
    },
  };
});

// Keep several open tabs on the same language.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && isLocale(event.newValue)) {
      applyDocumentLang(event.newValue);
      useLocaleStore.setState({ locale: event.newValue });
    }
  });
}
