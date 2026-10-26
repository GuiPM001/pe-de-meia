import React, { useEffect } from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { useProfile } from "@/app/context/ProfileContext";
import { getGoalStatusStyles, getGoalTextStyles } from "@/core/utils/goalStyle";
import { useCalendar } from "../hooks/useCalendar";
import TransactionsDots from "./transactionsDots";

interface DaysGridProps {
  isLoading: boolean;
  selectedDay: DayBalance | undefined;
  setSelectedDay: (dayBalance: DayBalance) => void;
}

export default function DaysGrid({
  isLoading,
  selectedDay,
  setSelectedDay,
}: DaysGridProps) {
  const { profile } = useProfile();
  const { dayBalances, isToday } = useCalendar();

  useEffect(() => {
    const today = dayBalances.find((x) => isToday(x));

    if (today) setSelectedDay(today);
  }, [dayBalances]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayBalances.map((dayData, index) => (
        <button
          key={index}
          onClick={() => setSelectedDay(dayData)}
          disabled={isLoading || dayData.total === null}
          className={`
            relative flex flex-col items-center justify-start pt-2 pb-1 rounded-xl min-h-[52px]
                transition-all duration-200
                ${getGoalStatusStyles(dayData.total, profile.savingTarget, selectedDay === dayData)}
              ${isLoading ? "skeleton" : ""}
            `}
        >
          <span
            className={`text-sm ${getGoalTextStyles(dayData.total, profile.savingTarget, selectedDay === dayData)}`}
          >
            {dayData.day}
          </span>

          <TransactionsDots day={dayData} />
        </button>
      ))}
    </div>
  );
}
