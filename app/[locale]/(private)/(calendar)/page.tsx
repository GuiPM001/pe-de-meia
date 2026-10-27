"use client";

import { useState } from "react";
import { DayBalance } from "@/core/types/DayBalance";

import Legend from "@/components/legend";
import MonthSelector from "./components/monthSelector";
import DaySummary from "./components/daySummary";
import WeekDaysHeader from "./components/weekDaysHeader";
import DaysGrid from "./components/daysGrid";

import "@/core/utils/date.extensions";

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState<DayBalance>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <MonthSelector />

        <div className="bg-white w-full rounded-2xl border border-gray-200 p-4 shadow-sm">
          <WeekDaysHeader />

          <DaysGrid
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />

          <Legend />
        </div>

        <DaySummary selectedDay={selectedDay} />
      </div>
    </>
  );
}
