"use client";

import { useState } from "react";
import Calendar from "@/components/calendar";
import Sidebar from "@/components/sidebar";
import { getMonthNameByMonth } from "@/core/utils/date";
import {
  TbCirclePlusFilled,
  TbInfoCircleFilled,
  TbSettingsFilled,
} from "react-icons/tb";
import TransactionModal from "@/components/modals/transactionModal";
import IconButton from "@/components/ui/iconButton";
import ProfileModal from "@/components/modals/profileModal";
import InfoModal from "@/components/modals/infoModal";
import { Month } from "@/core/types/Month";
import "@/core/utils/date.extensions";

export default function Home() {
  const [indexMonthSelected, setIndexMonthSelected] = useState<number>(
    new Date().getUTCMonth()
  );
  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  );
  const [monthSelected, setMonthSelected] = useState<Month>({
    balance: 0,
    id: new Date(yearSelected, indexMonthSelected, 1).toISODateString(),
    idUser: "",
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  return (
    <div className="w-screen h-screen flex flex-row py-6 px-6 overflow-x-hidden">
      <Sidebar
        monthSelected={indexMonthSelected}
        setMonthSelected={setIndexMonthSelected}
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
        setMonth={setMonthSelected}
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row gap-5 items-center">
          <span className="capitalize font-black text-3xl">
            {getMonthNameByMonth(yearSelected, indexMonthSelected)}
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
          <IconButton
            label="Informações"
            onClick={() => setInfoModalOpen(true)}
          >
            <TbInfoCircleFilled size="24px" />
          </IconButton>
        </div>

        <Calendar
          month={monthSelected}
          indexMonth={indexMonthSelected}
          year={yearSelected}
        />
      </div>

      {modalOpen && (
        <TransactionModal
          onClose={() => setModalOpen(false)}
          idMonth={monthSelected.id}
        />
      )}

      {infoModalOpen && <InfoModal onClose={() => setInfoModalOpen(false)} />}

      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}
