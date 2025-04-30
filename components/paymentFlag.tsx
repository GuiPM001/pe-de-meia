"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";

interface PaymentFlagProps {
  dayBalance: DayBalance;
}

export default function PaymentFlag({ dayBalance }: PaymentFlagProps) {
  const { profile } = useProfile();

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
    <div className={`flex flex-row justify-around p-2`}>
      <span className="px-1 font-bold">{dayBalance.day}</span>
      <span className={`mr-4 ${getColors(dayBalance.total!, profile.savingTarget)} px-2 rounded-md font-bold`}>
        {currencyValue}
      </span>
    </div>
  );
}
