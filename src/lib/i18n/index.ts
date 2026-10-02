import { common } from "./dict-common";
import { laboratory } from "./dict-laboratory";
import { sales } from "./dict-sales";

export type Locale = "fa" | "en";

export const LOCALES = ["fa", "en"] as const;

/** Persian first: the brief puts the domestic market before anything else. */
export const DEFAULT_LOCALE: Locale = "fa";

/**
 * A piece of content that exists in both languages. Data carries this shape
 * directly — a customer name or a product name belongs with the record, not in
 * the interface dictionary.
 */
export type I18nText = { fa: string; en: string };

export type Dict = Record<string, I18nText>;

const dict = { ...common, ...laboratory, ...sales };

export type DictKey = keyof typeof dict;

export function t(locale: Locale, key: DictKey): string {
  return dict[key][locale];
}

/** Resolves an {fa, en} pair carried by a data record. */
export function pick(text: I18nText, locale: Locale): string {
  return text[locale];
}

export function isLocale(v: unknown): v is Locale {
  return v === "fa" || v === "en";
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fa" ? "en" : "fa";
}

export const LOCALE_LABEL: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

/**
 * Inline bilingual copy, matching the convention the dashboards already use.
 * Short, one-off interface strings read better next to the markup they belong
 * to than behind a dictionary key; the dictionary is for copy shared across
 * pages.
 */
export function makeCopy(locale: Locale) {
  return (en: string, fa: string) => (locale === "fa" ? fa : en);
}
