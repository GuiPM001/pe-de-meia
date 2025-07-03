"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo-symbol.png";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { TbUserFilled } from "react-icons/tb";
import { TbLogout } from "react-icons/tb";
import IconButton from "./ui/iconButton";
import ProfileModal from "./modals/profileModal";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t } = useTranslation();
  const { locale } = useParams();

  const pathname = usePathname();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
    <div className="w-screen flex flex-row px-20 py-4 h-16 items-center gap-8 self-center relative">
      <div className="flex flex-row items-center mr-4">
        <Image alt="Pé de meia logo" src={logo} width={28} />
        <span className="ml-1 w-18 leading-none text-wrap font-extrabold text-xl text-green-800">
          Pé de Meia
        </span>
      </div>

      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${
            pathname === href
              ? "text-green-text font-semibold hover:no-underline"
              : "text-black hover:underline"
          }`}
        >
          {label}
        </Link>
      ))}

      <div className="absolute right-20 flex flex-row gap-4">
        <IconButton
          className="text-2xl"
          label={t('tooltips.profile')}
          onClick={() => setModalOpen(true)}
        >
          <TbUserFilled />
        </IconButton>

        <IconButton 
          className="text-2xl" 
          label={t('tooltips.logout')} 
          onClick={() => logout()}>
          <TbLogout />
        </IconButton>
      </div>

      <div className="h-0.5 w-full rounded-xl left-0 right-0 m-auto bg-green-default bottom-0 absolute"></div>

      <ProfileModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </div>
  );
}
