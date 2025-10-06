import React from "react";
import IconButton from "../ui/iconButton";
import { TbLogout, TbUserFilled } from "react-icons/tb";
import { MenuProps } from "./navbar";
import NavLink from "./navLink";

export default function DesktopMenu({
  navItens,
  pathname,
  setModalOpen,
  logout,
  t,
}: MenuProps) {
  return (
    <div className="hidden lg:flex items-center justify-between w-full">
      <div className="flex flex-row gap-8">
        {navItens.map(({ href, label }) => (
          <NavLink
            key={href}
            pathname={pathname}
            label={label}
            href={href}
          />
        ))}
      </div>

      <div className="flex flex-row gap-8">
        <IconButton
          className="text-2xl"
          label={t("tooltips.profile")}
          onClick={() => setModalOpen(true)}
        >
          <TbUserFilled />
        </IconButton>

        <IconButton
          className="text-2xl"
          label={t("tooltips.logout")}
          onClick={() => logout()}
        >
          <TbLogout />
        </IconButton>
      </div>
    </div>
  );
}
