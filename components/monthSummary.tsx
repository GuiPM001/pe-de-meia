"use client";

import { DayBalance } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import MonthSummaryCard from "./monthSummaryCard";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/app/context/ProfileContext";
import { TbChartPie, TbTrendingDown, TbWallet } from "react-icons/tb";
interface MonthSummaryProps {
  dayBalances: DayBalance[];
  loading: boolean;
}

export default function MonthSummary({
  dayBalances,
  loading,
}: MonthSummaryProps) {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const [dailyBalance, setDailyBalance] = useState<number>(0);

  useEffect(() => {
    const today = new Date().getDate();

    const daily = dayBalances.find((d) => d.day === today && d.total !== null);

    if (daily) setDailyBalance(daily.total!);
  }, [dayBalances]);

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <MonthSummaryCard
        label={t("monthSummary.dailyBalance")}
        value={dailyBalance}
        className="bg-green-default/50 border border-green-text/50"
        backgroundIcon="bg-green-text"
        icon={TbWallet}
        loading={loading}
      />

      <MonthSummaryCard
        label={t("monthSummary.dailyCost")}
        value={profile.dailyCost}
        className="bg-yellow-default/50 border border-yellow-text/50"
        backgroundIcon="bg-yellow-text"
        icon={TbTrendingDown}
        loading={loading}
      />

      <button
        disabled={loading}
        className="col-span-2 rounded-lg p-4 flex flex-row justify-between items-center bg-white border border-gray-300 shadow-sm hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500"
      >
        <span className="text-lg font-semibold">
          {t("monthSummary.report")}
        </span>
        <TbChartPie className="h-6 w-10" />
      </button>
    </div>
  );
}
