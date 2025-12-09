"use client";

import { DayBalance } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import BalanceLabel from "./balanceLabel";
import { sumValues } from "@/core/utils/sumValues";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/app/context/ProfileContext";
import { getColors } from "@/core/utils/getColors";

interface MonthSummaryProps {
  dayBalances: DayBalance[];
}

type Totals = {
  income: number;
  expense: number;
  daily: number;
  dayBalance: number;
  monthBalance: number;
};

export default function MonthSummary({ dayBalances }: MonthSummaryProps) {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const [totals, setTotals] = useState<Totals>({
    income: 0,
    expense: 0,
    daily: 0,
    dayBalance: 0,
    monthBalance: 0,
  });

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let daily = 0;
    let dayBalance = 0;
    const today = new Date().getDate();

    dayBalances.forEach((d) => {
      if (d.day === today && d.total !== null) {
        dayBalance = d.total!;
      }

      income += sumValues(d.incomes ?? []);
      expense += sumValues(d.expenses ?? []);
      daily += sumValues(d.dailies ?? []);
    });

    const lastIndexDay = dayBalances.findLastIndex(
      (v) => v.total !== null
    );
    const monthBalance =
      dayBalances.at(lastIndexDay)?.total ?? 0;

    setTotals({ income, expense, daily, dayBalance, monthBalance });
  }, []);

  return (
    <>
      <div className="col-span-7 lg:flex justify-between mt-8 mb-4 hidden">
        <BalanceLabel label={t("home.totalIncome")} value={totals.income} />
        <BalanceLabel label={t("home.totalExpense")} value={totals.expense} />
        <BalanceLabel label={t("home.totalDaily")} value={totals.daily} />
      </div>

      <div className="col-span-7 flex flex-row justify-between mt-6 px-2 lg:hidden">
        <BalanceLabel
          label={t("home.balanceLabel")}
          value={totals.dayBalance}
          colorValue={getColors(totals.dayBalance, 0, profile.savingTarget, false, false)}
        />
        <BalanceLabel
          label={t("home.dailyLabel")}
          value={profile.dailyCost}
        />
        <BalanceLabel
          label={t("home.monthBalance")}
          value={totals.monthBalance}
          colorValue={getColors(totals.monthBalance, 0, profile.savingTarget, false, false)}
        />
      </div>
    </>
  );
}
