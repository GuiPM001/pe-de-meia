import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/public/locales/en/translation.json";
import pt from "@/public/locales/pt/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
