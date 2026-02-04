import React from "react";
import { useCalendar } from "./useCalendar";
import { useMonth } from "@/app/context/MonthContext";
import Legend from "./legend";
import Header from "./header";
import WeekDaysHeader from "./weekDaysHeader";
import DaysGrid from "./daysGrid";
import MonthSummary from "../monthSummary";

export interface CalendarProps {
  loading: boolean;
  yearSelected: number;
}

export default function Calendar(props: CalendarProps) {
  const { dayBalances, isCalculating, isToday } = useCalendar();
  const { monthSelected } = useMonth();

  const isLoading = props.loading || isCalculating;

  return (
    <div className="flex flex-col gap-8 w-full">
      <MonthSummary dayBalances={dayBalances} loading={isLoading} />
      
      <div className="bg-white w-full rounded-2xl border border-gray-200 p-4 lg:p-6 shadow-sm">
        <Header month={monthSelected.id} year={props.yearSelected} />

        <WeekDaysHeader />

        <DaysGrid
          dayBalances={dayBalances}
          isToday={isToday}
          isLoading={isLoading}
        />

        <Legend />
      </div>
    </div>
  );
}
