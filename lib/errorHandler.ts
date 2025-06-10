import en from "@/public/locales/en/translation.json";
import pt from "@/public/locales/pt/translation.json";

const translations = {
  en,
  pt,
};

export type SupportedLocale = "en" | "pt";

export function t(locale: SupportedLocale, key: string): string {
  const keys = key.split(".");
  let result: any = translations[locale];

  for (const k of keys) {
    result = result?.[k];
    if (!result) break;
  }

  return result || key;
}