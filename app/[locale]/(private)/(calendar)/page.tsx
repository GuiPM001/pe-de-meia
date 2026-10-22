"use client";

import { useEffect, useState } from "react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useCalendar } from "./components/useCalendar";
import { DayBalance } from "@/core/types/DayBalance";

import Wrapper from "@/components/ui/wrapper";
import MonthSelector from "./components/monthSelector";
import DaySummary from "./components/daySummary";
import WeekDaysHeader from "./components/weekDaysHeader";
import DaysGrid from "./components/daysGrid";
import Legend from "./components/legend";

import "@/core/utils/date.extensions";

export default function Home() {
  const { getMonths } = useMonth();
  const { profile, fetchProfile } = useProfile();
  const { isCalculating } = useCalendar();

  const [selectedDay, setSelectedDay] = useState<DayBalance>();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getMonths(profile._id), fetchProfile(profile.email)]);
    };

    loadData();
  }, [profile._id]);

  return (
    <Wrapper>
      <div className="flex flex-col gap-2">
        <MonthSelector />

        <div className="bg-white w-full rounded-2xl border border-gray-200 p-4 shadow-sm">
          <WeekDaysHeader />

          <DaysGrid
            isLoading={isCalculating}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />

          <Legend />
        </div>

        {selectedDay && <DaySummary dayBalance={selectedDay} />}
      </div>
    </Wrapper>
  );
}
