"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import ProfileModal from "../modals/profileModal";
import Logo from "./logo";
import MobileMenu from "./mobileMenu";
import DesktopMenu from "./desktopMenu";

export interface MenuProps {
  navItens: { href: string; label: string }[];
  pathname: string;
  t: TFunction<"translation", undefined>;
  setModalOpen: (modalOpen: boolean) => void;
  logout: () => void;
}

export default function NavBar() {
  const { t } = useTranslation();
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const NAV_ITEMS = [
    { href: `/${locale}`, label: t("navBar.monthlySummary") },
    { href: `/${locale}/investments`, label: t("navBar.investments") },
  ];

  const logout = () => {
    const expiryDate = new Date(1, 1, 1);
    document.cookie = `authToken=; path=/; expires=${expiryDate}; Secure; SameSite=Strict`;
    router.replace("/login");
  };

  return (
    <div className="w-full bg-white border-b border-green-default">
      <nav className="flex items-center justify-between gap-8 h-16 px-8 md:px-20 py-4">
        <Logo />

        <DesktopMenu
          navItens={NAV_ITEMS}
          pathname={pathname}
          setModalOpen={setModalOpen}
          logout={logout}
          t={t}
        />

        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navItens={NAV_ITEMS}
          pathname={pathname}
          setModalOpen={setModalOpen}
          logout={logout}
          t={t}
        />
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <ProfileModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </div>
  );
}
