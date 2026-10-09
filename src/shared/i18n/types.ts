export type Locale = 'ru' | 'ky' | 'en';

export interface LocaleMeta {
  code: Locale;
  /** Short label for the switcher ("RU", "KG", "EN"). */
  short: string;
  /** Language name in that language. */
  native: string;
  /** BCP 47 tag used for Intl formatting. */
  tag: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: 'ru', short: 'RU', native: 'Русский', tag: 'ru-RU' },
  { code: 'ky', short: 'KG', native: 'Кыргызча', tag: 'ky-KG' },
  { code: 'en', short: 'EN', native: 'English', tag: 'en-GB' },
];

export const DEFAULT_LOCALE: Locale = 'ru';

/** CLDR plural forms; every locale must provide `other`. */
export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** A dictionary tree: leaves are strings or plural forms. */
export interface DictionaryTree {
  [key: string]: string | PluralForms | DictionaryTree;
}

/** Turns the source (Russian) dictionary into the shape every translation must follow. */
export type Widen<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends { other: string }
      ? PluralForms
      : Widen<T[K]>;
};

/** Dot-separated paths to every leaf of a dictionary. */
export type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends { other: string }
      ? `${Prefix}${K}`
      : LeafPaths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslateParams = Record<string, string | number>;
