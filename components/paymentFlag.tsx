"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";
import { TbPlus } from "react-icons/tb";
import LoadingSpinner from "./ui/loadingSpinner";
import IconButton from "./ui/iconButton";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { currencyNumber } from "@/core/utils/numberFormat";
import { useTranslation } from "react-i18next";

interface PaymentFlagProps {
  dayBalance: DayBalance;
  totalInvested: number;
  today: boolean;
  loading: boolean;
}

export default function PaymentFlag({
  dayBalance,
  totalInvested,
  today,
  loading,
}: PaymentFlagProps) {
  const { profile } = useProfile();
  const { openModal } = useTransactionModal();
  const { t } = useTranslation();

  const [currencyValue, setCurrencyValue] = useState<string>();

  useEffect(() => {
    setCurrencyValue(currencyNumber(dayBalance.total!));
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
            totalInvested,
            profile.savingTarget
          )} px-2 rounded-md font-bold`}
        >
          {currencyValue}
        </span>
      )}

      <IconButton
        className="invisible group-hover:visible"
        label={t('iconButton.addTransaction')}
        onClick={() => openModal(dayBalance.idMonth, dayBalance.day)}
      >
        <TbPlus size="20px" />
      </IconButton>
    </div>
  );
}
