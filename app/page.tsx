"use client";

import { useState } from "react";
import Calendar from "./components/calendar";
import Sidebar from "./components/sidebar";
import { getMonthNameByMonth } from "./utils/date";
import {
  TbCirclePlusFilled,
  TbInfoCircleFilled,
  TbSettingsFilled,
} from "react-icons/tb";
import TransactionModal from "./components/modals/transactionModal";
import IconButton from "./components/core/iconButton";
import ProfileModal from "./components/modals/profileModal";

export default function Home() {
  const [monthSelected, setMonthSelected] = useState<number>(
    new Date().getMonth()
  );
  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  return (
    <div className="w-screen h-screen font-nunito flex flex-row py-6 px-6 overflow-x-hidden">
      <Sidebar
        monthSelected={monthSelected}
        setMonthSelected={setMonthSelected}
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row gap-5 items-center">
          <span className="capitalize font-black text-3xl">
            {getMonthNameByMonth(yearSelected, monthSelected)}
          </span>
          <IconButton
            onClick={() => setModalOpen(true)}
            label="Adicionar transação"
          >
            <TbCirclePlusFilled size="24px" />
          </IconButton>
          <IconButton
            onClick={() => setProfileModalOpen(true)}
            label="Configurar perfil"
          >
            <TbSettingsFilled size="24px" />
          </IconButton>
          <IconButton label="Informações">
            <TbInfoCircleFilled size="24px" />
          </IconButton>
        </div>

        <Calendar month={monthSelected} year={yearSelected} />
      </div>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}

      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}
