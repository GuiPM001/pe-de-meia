"use client";

import React, { useState } from "react";
import IconButton from "./ui/iconButton";
import { getMonthNameByMonth } from "@/core/utils/date";
import { TbCirclePlusFilled, TbInfoCircleFilled } from "react-icons/tb";
import InfoModal from "./modals/infoModal";
import { Month } from "@/core/types/Month";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  yearSelected: number;
  indexMonthSelected: number;
  month: Month;
}

export default function Header({
  yearSelected,
  indexMonthSelected,
  month,
}: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-5 items-center">
      <span className="capitalize font-black text-3xl">
        {getMonthNameByMonth(yearSelected, indexMonthSelected)}
      </span>
      <IconButton
        onClick={() => openModal(month.id)}
        label={t('tooltips.addTransaction')}
      >
        <TbCirclePlusFilled size="24px" />
      </IconButton>

      <IconButton label={t('tooltips.info')} onClick={() => setModalOpen(true)}>
        <TbInfoCircleFilled size="24px" />
      </IconButton>

      <InfoModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </div>
  );
}
