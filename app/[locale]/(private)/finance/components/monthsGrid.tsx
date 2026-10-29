import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { getMonthNameByMonth, getNextMonthId } from "@/core/utils/date";
import { cn } from "@/lib/utils";
import {
  getGoalStatus,
  getStatusStyles,
} from "@/core/utils/goalStyle";
import { getStatuses, MonthAvailability, MonthlyStatistics } from "../finance.types";
import Legend from "@/components/legend";
import "@/core/utils/date.extensions";
import LoadingSpinner from "@/components/ui/loadingSpinner";

interface MonthsGridProps {
  year: number;
}

export default function MonthsGrid({ year }: MonthsGridProps) {
  const { t } = useTranslation();
  const statuses = getStatuses(t);

  const { monthSelected, months, monthLoading, selectMonth, createMonth } = useMonth();
  const { profile } = useProfile();

  const nextCreatableId = useMemo(() => {
    if (!months.length) return null;

    const lastRegistered = [...months].sort((a, b) => a.id.localeCompare(b.id)).at(-1);
    return lastRegistered ? getNextMonthId(lastRegistered.id) : null;
  }, [months]);

  const getMonthAvailability = (isMonthRegistered: boolean, idMonth: string): MonthAvailability => {
    if (isMonthRegistered) return "registered";
    if (idMonth === nextCreatableId) return "creatable";
    return "disabled";
  };

  const getMonthlyStatistics = (indexMonth: number): MonthlyStatistics => {
    const idMonth = new Date(year, indexMonth, 1).toISODateString();

    const recordedMonth = months.find((x) => x.id === idMonth);
    const availability = getMonthAvailability(
      recordedMonth !== undefined,
      idMonth,
    );

    return {
      availability,
      idMonth,
      balance: recordedMonth?.balance ?? 0,
      status: getGoalStatus(
        idMonth,
        recordedMonth?.balance,
        profile.savingTarget,
        recordedMonth?.invested ?? 0,
        availability,
      ),
    };
  };

  const getButtonClass = (stats: MonthlyStatistics, selected: boolean) => {
    
    return getStatusStyles(stats.status, selected);
  };

  return (
    <section className="my-6">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, index) => {
          const stats = getMonthlyStatistics(index);
          const selected = stats.idMonth === monthSelected.id;
          const item = statuses[stats.status];
          const Icon = item.icon;
          const isLoading = monthLoading === stats.idMonth;

          return (
            <button
              key={index}
              disabled={stats.availability === "disabled" || Boolean(monthLoading)}
              onClick={() => {
                if (stats.availability === "creatable") {
                  createMonth(stats.idMonth, profile._id);
                  return;
                }

                selectMonth(stats.idMonth);
              }}
              className={cn(
                "flex flex-col justify-center items-center gap-1.5 py-3 rounded-lg border border-transparent",
                getButtonClass(stats, selected),
              )}
            >
              <span className="text-sm font-semibold capitalize">
                {getMonthNameByMonth(year, index)}
              </span>
              <span className="flex items-center justify-self-center gap-1 text-[10px] font-medium">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Icon className="!h-3 !w-3" />
                    {statuses[stats.availability]?.short || item.short}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <Legend />
    </section>
  );
}
