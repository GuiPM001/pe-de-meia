"use client";

import React, { useState } from "react";
import ProfileModal from "../modals/profileModal";
import Logo from "./logo";
import IconButton from "../ui/iconButton";
import { signOut } from "next-auth/react";
import { TbLogout, TbUser } from "react-icons/tb";

export default function NavBar() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const logout = async () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="w-full bg-white">
      <nav className="flex items-center justify-between gap-8 h-16 px-8 lg:px-20 py-4">
        <Logo />

        <div className="flex flex-row gap-8 text-gray-500">
          <IconButton className="text-2xl" onClick={() => setModalOpen(true)}>
            <TbUser size="22px" />
          </IconButton>

          <IconButton className="text-2xl" onClick={() => logout()}>
            <TbLogout size="22px" />
          </IconButton>
        </div>
      </nav>

      <ProfileModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </div>
  );
}
