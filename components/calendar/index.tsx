import React from "react";
import CalendarMobile from "./calendarMobile";
import CalendarDesktop from "./calendarDesktop";
import { useCalendar } from "./useCalendar";
import { DayBalance } from "@/core/types/DayBalance";

export interface CalendarProps {
  loading: boolean;
}

export interface CalendarComponentProps {
  dayBalances: DayBalance[];
  isToday: (dayBalance: DayBalance) => boolean;
  isLoading: boolean;
}

export default function Calendar(props: CalendarProps) {
  const { dayBalances, isCalculating, isToday } = useCalendar();

  const isLoading = props.loading || isCalculating;

  return (
    <>
      <div className="block lg:hidden">
        <CalendarMobile
          dayBalances={dayBalances}
          isLoading={isLoading}
          isToday={isToday}
        />
      </div>

      <div className="hidden lg:block">
        <CalendarDesktop
          dayBalances={dayBalances}
          isLoading={isLoading}
          isToday={isToday}
        />
      </div>
    </>
  );
}
