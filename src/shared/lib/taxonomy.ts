import type { TranslationKey } from '@/shared/i18n';

/**
 * Fixed vocabularies stored on profiles. Older records keep Russian names, newer ones store
 * codes; both resolve to a translation key so the UI shows them in the current language.
 */
export const LANGUAGE_CODES = ['ky', 'ru', 'en', 'kk', 'uz', 'de'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

const LANGUAGE_BY_NAME: Record<string, LanguageCode> = {
  Кыргызский: 'ky',
  Русский: 'ru',
  Английский: 'en',
  Казахский: 'kk',
  Узбекский: 'uz',
  Немецкий: 'de',
};

export const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  ky: '🇰🇬',
  ru: '🇷🇺',
  en: '🇬🇧',
  kk: '🇰🇿',
  uz: '🇺🇿',
  de: '🇩🇪',
};

export const languageCode = (value: string): LanguageCode | null =>
  (LANGUAGE_CODES as readonly string[]).includes(value) ? (value as LanguageCode) : (LANGUAGE_BY_NAME[value] ?? null);

export const languageKey = (code: LanguageCode): TranslationKey => `auth.languageOptions.${code}`;

export const INTEREST_CODES = ['mountains', 'nature', 'horses', 'culture', 'camping', 'cuisine'] as const;
export type InterestCode = (typeof INTEREST_CODES)[number];

const INTEREST_BY_NAME: Record<string, InterestCode> = {
  Горы: 'mountains',
  Природа: 'nature',
  Лошади: 'horses',
  Культура: 'culture',
  Кемпинг: 'camping',
  Кухня: 'cuisine',
};

export const interestCode = (value: string): InterestCode | null =>
  (INTEREST_CODES as readonly string[]).includes(value) ? (value as InterestCode) : (INTEREST_BY_NAME[value] ?? null);
