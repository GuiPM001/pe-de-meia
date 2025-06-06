"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { MonthProvider } from "./context/MonthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { useParams } from "next/navigation";

export function Providers({
  children
}: {
  children: ReactNode;
}) {
  const { locale } = useParams();
  
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale as string);
    }
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <ProfileProvider>
        <MonthProvider>{children}</MonthProvider>
      </ProfileProvider>
    </I18nextProvider>
  );
}
