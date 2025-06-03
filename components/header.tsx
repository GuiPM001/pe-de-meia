"use client";

import React, { useState } from "react";
import IconButton from "./ui/iconButton";
import { getMonthNameByMonth } from "@/core/utils/date";
import { TbCirclePlusFilled, TbInfoCircleFilled } from "react-icons/tb";
import InfoModal from "./modals/infoModal";
import { Month } from "@/core/types/Month";
import { useTransactionModal } from "@/app/context/TransactionModalContext";

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

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-row gap-5 items-center">
      <span className="capitalize font-black text-3xl">
        {getMonthNameByMonth(yearSelected, indexMonthSelected)}
      </span>
      <IconButton
        onClick={() => openModal(month.id)}
        label="Adicionar transação"
      >
        <TbCirclePlusFilled size="24px" />
      </IconButton>

      <IconButton label="Informações" onClick={() => setModalOpen(true)}>
        <TbInfoCircleFilled size="24px" />
      </IconButton>

      <InfoModal onClose={() => setModalOpen(false)} open={modalOpen} />
    </div>
  );
}
