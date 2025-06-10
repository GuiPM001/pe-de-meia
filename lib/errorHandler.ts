import en from "@/public/locales/en/translation.json";
import pt from "@/public/locales/pt/translation.json";

const translations = {
  en,
  pt,
};

export type SupportedLocale = "en" | "pt";

export function t(locale: SupportedLocale, key: string): string {
  const keys = key.split(".");
  let result: unknown = translations[locale];

  for (const k of keys) {
    if (typeof result === "object" && result !== null && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof result === "string" ? result : key;
}
