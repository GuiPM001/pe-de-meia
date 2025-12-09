import React from "react";
import { Month } from "@/core/types/Month";
import { useCalendar } from "./useCalendar";
import CalendarMobile from "./calendarMobile";
import CalendarDesktop from "./calendarDesktop";
import { DayBalance } from "@/core/types/DayBalance";

export interface CalendarProps {
  month: Month;
  indexMonth: number;
  year: number;
}

export interface CalendarComponentProps {
  dayBalances: DayBalance[];
  loading: boolean;
  indexMonth: number;
}

export default function Calendar(props: CalendarProps) {
  const { loading, dayBalances } = useCalendar(props);

  return (
    <>
      <div className="block lg:hidden">
        <CalendarMobile
          dayBalances={dayBalances}
          loading={loading}
          indexMonth={props.indexMonth}
        />
      </div>

      <div className="hidden lg:block">
        <CalendarDesktop
          dayBalances={dayBalances}
          loading={loading}
          indexMonth={props.indexMonth}
        />
      </div>
    </>
  );
}
