import React from "react";
import { useTranslation } from "react-i18next";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { getMonthNameByMonth } from "@/core/utils/date";
import { cn } from "@/lib/utils";
import { getMonthStatusStyles, GoalStatus } from "@/core/utils/goalStyle";
import { getStatuses, MonthAvailability, MonthlyStatistics } from "../finance.types";
import Legend from "@/components/legend";
import { Month } from "@/core/types/Month";

interface MonthsGridProps {
  year: number;
  getGoalStatus: (
    month: Month | undefined,
    availability: MonthAvailability,
  ) => GoalStatus;
}

export default function MonthsGrid({ year, getGoalStatus }: MonthsGridProps) {
  const { t } = useTranslation();
  const statuses = getStatuses(t);
  const now = new Date();

  const { monthSelected, months, selectMonth, createMonth } = useMonth();
  const { profile } = useProfile();

  const getMonthAvailability = (isMonthRegistered: boolean, month: number) => {
    if (isMonthRegistered) return "registered";

    if (year * 12 + month > now.getFullYear() * 12 + now.getMonth())
      return "creatable";

    return "disabled";
  };

  const getMonthlyStatistics = (indexMonth: number): MonthlyStatistics => {
    const idMonth = `${year}-${(indexMonth + 1).toString().padStart(2, "0")}-01`;

    const recordedMonth = months.find((x) => x.id === idMonth);
    const availability = getMonthAvailability(
      recordedMonth !== undefined,
      indexMonth,
    );

    return {
      availability,
      idMonth,
      balance: recordedMonth?.balance ?? 0,
      status: getGoalStatus(recordedMonth, availability),
    };
  };

  const getButtonClass = (stats: MonthlyStatistics, selected: boolean) => {
    if (stats.availability === "creatable")
      return "border border-dashed border-primary/40 bg-primary/5 text-primary";

    if (stats.availability === "disabled")
      return "bg-muted text-muted-foreground border-border disabled:opacity-100";

    return getMonthStatusStyles(stats.status, selected);
  };

  return (
    <section className="my-6">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, index) => {
          const stats = getMonthlyStatistics(index);
          const selected = stats.idMonth === monthSelected.id;
          const item = statuses[stats.status];
          const Icon = item.icon;

          return (
            <button
              key={index}
              disabled={stats.availability === "disabled"}
              onClick={() => {
                if (stats.availability === "creatable")
                  createMonth(stats.idMonth, profile._id, year);

                selectMonth(stats.idMonth);
              }}
              className={cn(
                "flex flex-col justify-center items-center gap-1.5 py-3 rounded-lg",
                getButtonClass(stats, selected),
              )}
            >
              <span className="text-sm font-semibold capitalize">
                {getMonthNameByMonth(year, index)}
              </span>
              <span className="flex items-center justify-self-center gap-1 text-[10px] font-medium">
                <Icon className="!h-3 !w-3" />
                {statuses[stats.availability]?.short || item.short}
              </span>
            </button>
          );
        })}
      </div>
      <Legend />
    </section>
  );
}
