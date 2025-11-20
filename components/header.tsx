"use client";

import React, { useState } from "react";
import IconButton from "./ui/iconButton";
import { getMonthNameByMonth } from "@/core/utils/date";
import { TbCirclePlusFilled, TbInfoCircleFilled } from "react-icons/tb";
import InfoModal from "./modals/infoModal";
import { Month } from "@/core/types/Month";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { useTranslation } from "react-i18next";
import MonthsModal from "./modals/monthsModal";

interface HeaderProps {
  yearSelected: number;
  indexMonthSelected: number;
  month: Month;
  setMonth: (month: Month) => void;
  setMonthSelected: (month: number) => void;
}

export default function Header({
  yearSelected,
  indexMonthSelected,
  month,
  setMonth,
  setMonthSelected,
}: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { t } = useTranslation();

  const [infoModalOpen, setInfoModalInfoOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-5 items-center px-2 md:px-0">
      <span className="hidden lg:block capitalize font-black text-3xl">
        {getMonthNameByMonth(yearSelected, indexMonthSelected)}
      </span>

      <button
        onClick={() => setMonthModalOpen(true)}
        className="lg:hidden block capitalize font-black text-3xl cursor-pointer"
      >
        {getMonthNameByMonth(yearSelected, indexMonthSelected)}
      </button>

      <IconButton
        onClick={() => openModal(month.id)}
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
        actualMonth={month}
        setMonth={setMonth}
        setMonthSelected={setMonthSelected}
      />
    </div>
  );
}
