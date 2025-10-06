import React from "react";
import IconButton from "../ui/iconButton";
import { HiMenu, HiX } from "react-icons/hi";
import { TbLogout, TbUserFilled } from "react-icons/tb";
import { MenuProps } from "./navbar";
import Logo from "./logo";
import NavLink from "./navLink";

interface MobileMenuPropos extends MenuProps {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  navItens,
  pathname,
  setModalOpen,
  logout,
  t,
}: MobileMenuPropos) {
  return (
    <div className="flex flex-row gap-6 lg:hidden">
      <IconButton
        className="text-2xl"
        label={t("tooltips.profile")}
        onClick={() => {
          setModalOpen(true);
          setMenuOpen(false);
        }}
      >
        <TbUserFilled />
      </IconButton>

      <IconButton
        className="text-2xl"
        label={t("tooltips.logout")}
        onClick={() => {
          setMenuOpen(true);
        }}
      >
        <HiMenu />
      </IconButton>

      <IconButton
        className="text-2xl"
        label={t("tooltips.logout")}
        onClick={() => {
          logout();
          setMenuOpen(false);
        }}
      >
        <TbLogout />
      </IconButton>

      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Logo />
          <IconButton
            className="text-2xl"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <HiX />
          </IconButton>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          {navItens.map(({ href, label }) => (
            <NavLink
              key={href}
              pathname={pathname}
              label={label}
              href={href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
