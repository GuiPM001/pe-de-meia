"use client";

import { DayBalance } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import BalanceLabel from "./balanceLabel";
import { sumValues } from "@/core/utils/sumValues";

interface CalendarHeaderProps {
  dayBalances: DayBalance[];
}

type Totals = {
  income: number;
  expense: number;
  daily: number;
};

export default function CalendarHeader({ dayBalances }: CalendarHeaderProps) {
  const className =
    "border border-t-0 border-gray-200 text-center font-black py-1 self-end mt-4";

  const [totals, setTotals] = useState<Totals>({
    income: 0,
    expense: 0,
    daily: 0,
  });

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let daily = 0;

    dayBalances.forEach((d) => {
      income += sumValues(d.incomes ?? []);
      expense += sumValues(d.expenses ?? []);
      daily += sumValues(d.dailies ?? []);
    });

    setTotals({ income, expense, daily });
  }, [dayBalances]);

  return (
    <>
      <div className="col-span-7 flex justify-between mt-8 mb-4">
        <BalanceLabel label="Total de entradas:" value={totals.income} />
        <BalanceLabel label="Total de despesas fixas:" value={totals.expense} />
        <BalanceLabel label="Total de gasto diário:" value={totals.daily} />
      </div>

      <>
        <div className={className}>DOM.</div>
        <div className={className}>SEG.</div>
        <div className={className}>TER.</div>
        <div className={className}>QUA.</div>
        <div className={className}>QUI.</div>
        <div className={className}>SEX.</div>
        <div className={className}>SAB.</div>
      </>
    </>
  );
}
