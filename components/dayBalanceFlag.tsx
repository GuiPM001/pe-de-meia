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
import Tooltip from "./ui/tooltip";

interface DayBalanceFlagProps {
  dayBalance: DayBalance;
  totalInvested: number;
  isToday: boolean;
  loading: boolean;
}

export default function DayBalanceFlag({
  dayBalance,
  totalInvested,
  isToday,
  loading,
}: DayBalanceFlagProps) {
  const { profile } = useProfile();
  const { openModal } = useTransactionModal();
  const { t } = useTranslation();

  const [currencyValue, setCurrencyValue] = useState<string>();

  useEffect(() => {
    setCurrencyValue(currencyNumber(dayBalance.total!));
  }, [dayBalance]);

  return (
    <div className="flex lg:flex-row flex-col justify-between items-center m-2 relative">
      <span
        className={`hidden lg:block w-7 text-center font-bold  
          ${isToday ? "bg-gray-600 rounded-md text-white" : ""}
        `}
      >
        {dayBalance.day}
      </span>

      <span
        className={`block lg:hidden text-center font-bold h-8 w-8 content-center
          ${getColors(dayBalance.total!, totalInvested, profile.savingTarget, isToday)} rounded-full
        `}
      >
        {dayBalance.day}
      </span>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="group hidden lg:block">
          <span
            className={`${getColors(
              dayBalance.total!,
              totalInvested,
              profile.savingTarget
            )} px-2 rounded-md font-bold`}
          >
            {currencyValue}
          </span>

          <Tooltip position="bottom" label={t("tooltips.balance")} />
        </div>
      )}

      <IconButton
        className="hidden lg:block invisible group-hover/day:visible"
        label={t("tooltips.addTransaction")}
        onClick={() => openModal(dayBalance.idMonth, dayBalance.day)}
      >
        <TbPlus size="20px" />
      </IconButton>
    </div>
  );
}
