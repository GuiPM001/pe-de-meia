"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";
import { TbPlus } from "react-icons/tb";
import IconButton from "./ui/iconButton";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { decimalNumber } from "@/core/utils/numberFormat";
import { useTranslation } from "react-i18next";
import Tooltip from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";

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
    setCurrencyValue(decimalNumber(dayBalance.total!));
  }, [dayBalance]);

  return (
    <div className="flex lg:flex-row flex-col justify-between items-center relative m-2 lg:m-0 gap-2">
      <span
        className={`hidden lg:block w-7 text-center font-bold text-sm  
          ${isToday ? "bg-gray-600 rounded-md text-white" : ""}
        `}
      >
        {dayBalance.day}
      </span>

      <span
        className={`block lg:hidden text-center font-bold h-8 w-8 content-center
         ${
           loading
             ? "text-gray-400"
             : getColors(
                 dayBalance.total!,
                 totalInvested,
                 profile.savingTarget,
                 isToday
               )
         } rounded-full
        `}
      >
        {dayBalance.day}
      </span>
      {loading ? (
        <div className="mt-0 lg:mt-0">
          <Skeleton className="h-6 w-16" />
        </div>
      ) : (
        <div className="group hidden lg:block text-nowrap overflow-hidden text-sm">
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
