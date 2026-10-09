import { useCallback, useMemo } from 'react';
import { useLocaleStore } from './store';
import { localeTag, translate, type TranslationKey } from './translate';
import type { TranslateParams } from './types';

/**
 * Translation hook: `const { t, locale, fmt } = useT()`.
 * Components re-render when the language changes, without a page reload.
 */
export const useT = () => {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback((key: TranslationKey, params?: TranslateParams) => translate(locale, key, params), [locale]);

  const fmt = useMemo(() => {
    const tag = localeTag(locale);
    const number = new Intl.NumberFormat(tag);
    return {
      tag,
      number: (value: number) => number.format(value),
      /** "3 500 сом" / "3,500 som". */
      price: (value: number) => translate(locale, 'common.price', { amount: number.format(value) }),
      /** "3 500 сом / день". */
      pricePerDay: (value: number) => translate(locale, 'common.pricePerDay', { amount: number.format(value) }),
      rating: (value: number) => (Number.isInteger(value) ? value.toFixed(1) : String(value)),
      date: (value: string | Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
        new Date(value).toLocaleDateString(tag, options),
    };
  }, [locale]);

  return { t, locale, setLocale, fmt };
};
