"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";
import { TbPlus } from "react-icons/tb";
import LoadingSpinner from "./ui/loadingSpinner";
import IconButton from "./ui/iconButton";
import { useTransactionModal } from "@/app/context/TransactionModalContext";

interface PaymentFlagProps {
  dayBalance: DayBalance;
  today: boolean;
  loading: boolean;
}

export default function PaymentFlag({
  dayBalance,
  today,
  loading,
}: PaymentFlagProps) {
  const { profile } = useProfile();
  const { openModal } = useTransactionModal();

  const [currencyValue, setCurrencyValue] = useState<string>();

  useEffect(() => {
    setCurrencyValue(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(dayBalance.total!)
    );
  }, [dayBalance]);

  return (
    <div className="flex flex-row justify-between items-center p-2 relative">
      <span
        className={`w-7 text-center font-bold ${
          today ? "bg-gray-600 rounded-md text-white" : ""
        }`}
      >
        {dayBalance.day}
      </span>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <span
          className={`${getColors(
            dayBalance.total!,
            profile.savingTarget
          )} px-2 rounded-md font-bold`}
        >
          {currencyValue}
        </span>
      )}

      <IconButton
        className="invisible group-hover:visible"
        onClick={() => openModal(dayBalance.idMonth, dayBalance.day)}
      >
        <TbPlus size="20px" />
      </IconButton>
    </div>
  );
}
