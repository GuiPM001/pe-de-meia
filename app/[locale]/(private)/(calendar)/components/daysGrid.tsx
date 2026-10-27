import React, { useEffect } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { useProfile } from "@/app/context/ProfileContext";
import { getGoalStatus, getStatusStyles } from "@/core/utils/goalStyle";
import { useCalendar } from "../hooks/useCalendar";
import TransactionsDots from "./transactionsDots";
import { cn } from "@/lib/utils";

interface DaysGridProps {
  selectedDay: DayBalance | undefined;
  setSelectedDay: (dayBalance: DayBalance) => void;
}

export default function DaysGrid({
  selectedDay,
  setSelectedDay,
}: DaysGridProps) {
  const { profile } = useProfile();
  const { dayBalances, isToday, isCalculating } = useCalendar();

  useEffect(() => {
    const today = dayBalances.find((x) => isToday(x));

    if (today) setSelectedDay(today);
  }, [dayBalances]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayBalances.map((dayData, index) => {
        const availability = dayData.total ? "registered" : "disabled";
        const goalStatus = getGoalStatus(dayData.idMonth, dayData.total, profile.savingTarget, undefined, availability, true);
        const isSelected = selectedDay === dayData

        return (
          <button
            key={index}
            onClick={() => setSelectedDay(dayData)}
            disabled={isCalculating || dayData.total === null}
            className={cn(
              "relative flex flex-col items-center justify-start pt-2 pb-1 rounded-xl min-h-[52px] transition-all duration-200",
              getStatusStyles(goalStatus, isSelected),
              isSelected ? "" : "border-transparent",
              isCalculating ? "skeleton" : ""
            )}
          >
            <span
              className="text-sm"
            >
              {dayData.day}
            </span>

            <TransactionsDots day={dayData} />
          </button>
        )
      })}
    </div>
  );
}
