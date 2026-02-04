import React from "react";
import IconButton from "../ui/iconButton";
import { TbPlus } from "react-icons/tb";
import { getMonthNameByDate } from "@/core/utils/date";
import { useTransactionModal } from "@/app/context/TransactionModalContext";

interface CalendarHeaderProps {
  month: string;
  year: number;
}

export default function Header(props: CalendarHeaderProps) {
  const { openModal } = useTransactionModal();

  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="flex flex-row items-center gap-1 text-2xl font-bold capitalize">
        {getMonthNameByDate(props.month)}
      </h2>

      <span className="text-gray-500">{props.year}</span>

      <IconButton
        onClick={() => openModal(props.month)}
        className="h-8 w-8 rounded-xl bg-gray-100 border border-gray-300 ml-2 text-gray-500 hover:bg-green-text hover:text-white transition-all duration-200"
      >
        <TbPlus size="18px" />
      </IconButton>
    </div>
  );
}
