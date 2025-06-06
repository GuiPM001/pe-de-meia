"use client";

import { DayBalance } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import BalanceLabel from "./balanceLabel";
import { sumValues } from "@/core/utils/sumValues";
import { getWeekDays } from "@/core/utils/date";
import { useTranslation } from "react-i18next";

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
    "border border-t-0 border-gray-200 text-center font-black py-1 self-end mt-4 uppercase";

  const { t } = useTranslation();

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
        <BalanceLabel label={t('home.totalIncome')} value={totals.income} />
        <BalanceLabel label={t('home.totalExpense')} value={totals.expense} />
        <BalanceLabel label={t('home.totalDaily')} value={totals.daily} />
      </div>

      <>
        {getWeekDays().map((x) => (
          <div key={x} className={className}>
            {x}
          </div>
        ))}
      </>
    </>
  );
}
