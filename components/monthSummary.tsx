"use client";

import { DayBalance } from "@/core/types/DayBalance";
import React, { useEffect, useState } from "react";
import MonthSummaryCard from "./monthSummaryCard";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/app/context/ProfileContext";
import { TbChartPie, TbTrendingDown, TbWallet } from "react-icons/tb";
import { getAccentBackground, getColors } from "@/core/utils/getColors";
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
        className={getColors(dailyBalance, 0, profile.savingTarget, false, false)}
        backgroundIcon={getAccentBackground(dailyBalance, profile.savingTarget)}
        icon={TbWallet}
        loading={loading}
      />

      <MonthSummaryCard
        label={t("monthSummary.dailyCost")}
        value={profile.dailyCost}
        className="text-yellow-text"
        backgroundIcon="bg-yellow-text text-white"
        icon={TbTrendingDown}
        loading={loading}
      />

      <button
        disabled={loading}
        className="col-span-2 rounded-lg px-3 lg:px-4 py-3 flex flex-row justify-between items-center text-white/90 bg-primary border border-gray-300 shadow-sm hover:bg-primary-dark hover:text-white transition-all duration-200 cursor-pointer disabled:bg-gray-50 disabled:text-gray-500"
      >
        <span className="lg:text-lg font-semibold">
          {t("monthSummary.report")}
        </span>
        <TbChartPie className="h-6 w-10" />
      </button>
    </div>
  );
}
