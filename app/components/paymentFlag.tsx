"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "../types/DayBalance";

interface PaymentFlagProps {
  dayBalance: DayBalance;
}

export default function PaymentFlag({ dayBalance }: PaymentFlagProps) {
  const [currencyValue, setCurrencyValue] = useState<string>();

  useEffect(() => {
    setCurrencyValue(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(dayBalance.total!)
    );
  }, [dayBalance]);

  const getColors = () => {
    if (dayBalance.total! > 2500) return "bg-[#DDF1E3] text-[#00833B]";
    if (dayBalance.total! <= 0) return "bg-[#FBDED7] text-[#B8000F]";
    return "bg-[#FEF4D8] text-[#FFBB00]";
  }

  return (
    <div className={`flex flex-row justify-around p-2`}>
      <span className="px-1 font-bold">{dayBalance.day}</span>
      <span className={`mr-4 ${getColors()} px-2 rounded-md font-bold`}>{currencyValue}</span>
    </div>
  );
}
