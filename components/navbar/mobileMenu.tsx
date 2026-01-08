import React from "react";
import IconButton from "../ui/iconButton";
import { TbLogout, TbUserFilled } from "react-icons/tb";
import { MenuProps } from "./navbar";

interface MobileMenuProps extends MenuProps {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}

export default function MobileMenu({
  setMenuOpen,
  setModalOpen,
  logout,
  t,
}: MobileMenuProps) {
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
          logout();
          setMenuOpen(false);
        }}
      >
        <TbLogout />
      </IconButton>
    </div>
  );
}
