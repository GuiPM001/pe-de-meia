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
        <div className="group/balance">
          <span
            className={`${getColors(
              dayBalance.total!,
              totalInvested,
              profile.savingTarget
            )} px-2 rounded-md font-bold`}
          >
            {currencyValue}
          </span>
          <div className="absolute whitespace-nowrap top-full left-1/2 z-20 -translate-x-1/2 rounded bg-black py-2 px-4 text-sm text-white hidden group-hover/balance:block">
            <span className="absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
            <p className="text-bottom">{t("tooltips.balance")}</p>
          </div>
        </div>
      )}

      <IconButton
        className="invisible group-hover:visible"
        label={t("tooltips.addTransaction")}
        onClick={() => openModal(dayBalance.idMonth, dayBalance.day)}
      >
        <TbPlus size="20px" />
      </IconButton>
    </div>
  );
}
