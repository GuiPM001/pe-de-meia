"use client";

import React, { useEffect, useState } from "react";
import { DayBalance } from "./calendar";

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
      }).format(dayBalance.value)
    );
  }, [dayBalance]);

  const getBackgroundColor = () => {
    if (dayBalance.value > 2500) return "bg-[#57BB8A]";
    if (dayBalance.value < 0) return "bg-[#E67C73]";
    return "bg-[#FFE599]";
  }

  return (
    <div className={`flex flex-row justify-between ${getBackgroundColor()}`}>
      <span className="px-1 font-bold">{dayBalance.day}</span>
      <span className="mr-4">{currencyValue}</span>
    </div>
  );
}
