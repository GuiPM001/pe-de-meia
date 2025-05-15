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
import { TransactionProvider } from "@/app/context/TransactionContext";
import { MonthProvider } from "@/app/context/MonthContext";

export default function Home() {
  const [modalOpen, setModalOpen] = useState({
    transaction: false,
    profile: false,
    info: false,
  });
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

  return (
    <MonthProvider>
      <TransactionProvider>
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
                onClick={() => setModalOpen({ ...modalOpen, transaction: true })}
                label="Adicionar transação"
              >
                <TbCirclePlusFilled size="24px" />
              </IconButton>
              <IconButton
                onClick={() => setModalOpen({ ...modalOpen, profile: true })}
                label="Configurar perfil"
              >
                <TbSettingsFilled size="24px" />
              </IconButton>
              <IconButton
                label="Informações"
                onClick={() => setModalOpen({ ...modalOpen, info: true })}
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

          <TransactionModal
            onClose={() => setModalOpen({ ...modalOpen, transaction: false })}
            open={modalOpen.transaction}
            idMonth={monthSelected.id}
          />

          <ProfileModal
            onClose={() => setModalOpen({ ...modalOpen, profile: false })}
            open={modalOpen.profile}
          />

          <InfoModal
            onClose={() => setModalOpen({ ...modalOpen, info: false })}
            open={modalOpen.info}
          />
        </div>
      </TransactionProvider>
    </MonthProvider>
  );
}
