import { ru } from './locales/ru';
import { ky } from './locales/ky';
import { en } from './locales/en';
import { useLocaleStore } from './store';
import {
  LOCALES,
  type DictionaryTree,
  type LeafPaths,
  type Locale,
  type PluralForms,
  type TranslateParams,
} from './types';

export type TranslationKey = LeafPaths<typeof ru>;

const DICTIONARIES: Record<Locale, DictionaryTree> = { ru, ky, en };

export const localeTag = (locale: Locale) => LOCALES.find((l) => l.code === locale)?.tag ?? 'ru-RU';

const pluralRules = new Map<Locale, Intl.PluralRules>();
const getPluralRules = (locale: Locale) => {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(localeTag(locale));
    pluralRules.set(locale, rules);
  }
  return rules;
};

const lookup = (dict: DictionaryTree, key: string): string | PluralForms | undefined => {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) node = (node as Record<string, unknown>)[part];
    else return undefined;
  }
  return node as string | PluralForms | undefined;
};

const isPlural = (value: unknown): value is PluralForms =>
  Boolean(value) && typeof value === 'object' && 'other' in (value as object);

const interpolate = (template: string, params?: TranslateParams) =>
  params ? template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match)) : template;

/** Translate outside React (falls back to Russian, then to the key itself). */
export const translate = (locale: Locale, key: TranslationKey, params?: TranslateParams): string => {
  const value = lookup(DICTIONARIES[locale], key) ?? lookup(DICTIONARIES.ru, key);
  if (value === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key "${key}"`);
    return key;
  }
  if (isPlural(value)) {
    const count = Number(params?.count ?? 0);
    const form = getPluralRules(locale).select(count) as keyof PluralForms;
    return interpolate(value[form] ?? value.other, params);
  }
  if (typeof value !== 'string') return key;
  return interpolate(value, params);
};

/** Current-locale translate for non-component code (e.g. formatters). */
export const t = (key: TranslationKey, params?: TranslateParams) =>
  translate(useLocaleStore.getState().locale, key, params);
