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

/** Travel interests a profile can list ("Мои интересы"). */
export const INTEREST_CODES = [
  'hiking',
  'lakes',
  'heritage',
  'traditions',
  'food',
  'horses',
  'adventure',
  'family',
  'photography',
  'wellness',
  'roadtrips',
  'village',
] as const;
export type InterestCode = (typeof INTEREST_CODES)[number];

/** Earlier profiles stored Russian names or an older, shorter code list. */
const LEGACY_INTERESTS: Record<string, InterestCode> = {
  Горы: 'hiking',
  Природа: 'lakes',
  Лошади: 'horses',
  Культура: 'traditions',
  Кемпинг: 'adventure',
  Кухня: 'food',
  mountains: 'hiking',
  nature: 'lakes',
  culture: 'traditions',
  camping: 'adventure',
  cuisine: 'food',
};

export const interestCode = (value: string): InterestCode | null =>
  (INTEREST_CODES as readonly string[]).includes(value) ? (value as InterestCode) : (LEGACY_INTERESTS[value] ?? null);

/** Normalised, de-duplicated interest codes for a profile. */
export const interestCodes = (values: string[] | undefined): InterestCode[] =>
  [...new Set((values ?? []).map(interestCode).filter((c): c is InterestCode => c !== null))];
