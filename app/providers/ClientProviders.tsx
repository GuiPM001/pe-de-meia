"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { MonthProvider } from "../context/MonthContext";
import { useParams } from "next/navigation";
import { Profile } from "@/core/types/Profile";
import { ProfileProvider } from "../context/ProfileContext";
import { TransactionProvider } from "../context/TransactionContext";
import { TransactionModalProvider } from "../context/TransactionModalContext";
import { SessionProvider } from "next-auth/react";

export function ClientProviders({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile: Profile;
}) {
  const { locale } = useParams();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale as string);
    }
  }, [locale]);

  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <ProfileProvider initialProfile={initialProfile}>
          <MonthProvider>
            <TransactionProvider>
              <TransactionModalProvider>{children}</TransactionModalProvider>
            </TransactionProvider>
          </MonthProvider>
        </ProfileProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
