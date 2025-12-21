"use client";

import React, { useState } from "react";
import IconButton from "./ui/iconButton";
import { getMonthNameByDate } from "@/core/utils/date";
import { TbCirclePlusFilled, TbInfoCircleFilled } from "react-icons/tb";
import InfoModal from "./modals/infoModal";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { useTranslation } from "react-i18next";
import MonthsModal from "./modals/monthsModal";
import { useMonth } from "@/app/context/MonthContext";

interface HeaderProps {
  yearSelected: number;
  handleChangeYear: (year: number) => void;
  loading: boolean;
}

export default function Header({ yearSelected, handleChangeYear, loading }: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { monthSelected } = useMonth();
  const { t } = useTranslation();

  const [infoModalOpen, setInfoModalInfoOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-6 items-center px-2 lg:px-0 mt-4 mb-6 lg:mt-0 lg:mb-6">
      <span className="hidden lg:block capitalize font-nunito font-bold text-2xl text-gray-800 tracking-tight">
        {getMonthNameByDate(monthSelected.id)}
      </span>

      <button
        onClick={() => setMonthModalOpen(true)}
        className="lg:hidden block capitalize font-black text-3xl cursor-pointer"
      >
        {getMonthNameByDate(monthSelected.id)}
      </button>

      <IconButton
        onClick={() => openModal(monthSelected.id)}
        label={t("tooltips.addTransaction")}
      >
        <TbCirclePlusFilled size="24px" />
      </IconButton>

      <IconButton
        label={t("tooltips.info")}
        onClick={() => setInfoModalInfoOpen(true)}
      >
        <TbInfoCircleFilled size="24px" />
      </IconButton>

      <InfoModal
        onClose={() => setInfoModalInfoOpen(false)}
        open={infoModalOpen}
      />

      <MonthsModal
        onClose={() => setMonthModalOpen(false)}
        open={monthModalOpen}
        yearSelected={yearSelected}
        handleChangeYear={handleChangeYear}
        loading={loading}
      />
    </div>
  );
}
