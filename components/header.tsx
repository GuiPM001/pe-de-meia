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
}

export default function Header({ yearSelected }: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { monthSelected } = useMonth();
  const { t } = useTranslation();

  const [infoModalOpen, setInfoModalInfoOpen] = useState(false);
  const [monthModalOpen, setMonthModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-5 items-center px-2 md:px-0">
      <span className="hidden lg:block capitalize font-black text-3xl">
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
      />
    </div>
  );
}
