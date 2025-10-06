"use client";

import { MonthlySummary } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import BalanceLabel from "./balanceLabel";
import { sumValues } from "@/core/utils/sumValues";
import { getWeekDays } from "@/core/utils/date";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/app/context/ProfileContext";
import { getColors } from "@/core/utils/getColors";
import { currencyNumber } from "@/core/utils/numberFormat";

interface CalendarHeaderProps {
  monthlySummary: MonthlySummary;
}

type Totals = {
  income: number;
  expense: number;
  daily: number;
  dayBalance: number;
};

export default function CalendarHeader({
  monthlySummary,
}: CalendarHeaderProps) {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const [totals, setTotals] = useState<Totals>({
    income: 0,
    expense: 0,
    daily: 0,
    dayBalance: 0,
  });

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let daily = 0;
    let dayBalance = 0;
    const today = new Date().getDate();

    monthlySummary.dayBalances.forEach((d) => {
      if (d.day === today) dayBalance = d.total!;

      income += sumValues(d.incomes ?? []);
      expense += sumValues(d.expenses ?? []);
      daily += sumValues(d.dailies ?? []);
    });

    setTotals({ income, expense, daily, dayBalance });
  }, [monthlySummary]);

  return (
    <>
      <div className="col-span-7 lg:flex justify-between mt-8 mb-4 hidden">
        <BalanceLabel label={t("home.totalIncome")} value={totals.income} />
        <BalanceLabel label={t("home.totalExpense")} value={totals.expense} />
        <BalanceLabel label={t("home.totalDaily")} value={totals.daily} />
      </div>

      <div className="col-span-7 flex flex-row gap-18 mt-6 lg:hidden">
        <div className="flex flex-col">
          <span className="text-gray-400">{t("home.balanceLabel")}</span>
          <span
            className={`${getColors(totals.dayBalance, 0, profile.savingTarget, false, false)} font-bold`}
          >
            {currencyNumber(totals.dayBalance)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">{t("home.dailyLabel")}</span>
          <span className="font-bold">{currencyNumber(monthlySummary.remainingDailyExpenses)}</span>
        </div>
      </div>

      <div className="lg:hidden contents">
        {getWeekDays("narrow").map((x, i) => (
          <div
            key={`${x}-${i}`}
            className="border-b border-gray-200 text-center font-black py-1 self-end mt-4 uppercase"
          >
            {x}
          </div>
        ))}
      </div>
      <div className="lg:contents hidden ">
        {getWeekDays("short").map((x, i) => (
          <div
            key={`${x}-${i}`}
            className="border border-t-0 border-gray-200 text-center font-black py-1 self-end mt-4 uppercase"
          >
            {x}
          </div>
        ))}
      </div>
    </>
  );
}
