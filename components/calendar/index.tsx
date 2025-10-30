import React from "react";
import { Month } from "@/core/types/Month";
import { useCalendar } from "./useCalendar";
import CalendarMobile from "./calendarMobile";
import CalendarDesktop from "./calendarDesktop";
import { MonthlySummary } from "@/core/types/DayBalance";

export interface CalendarProps {
  month: Month;
  indexMonth: number;
  year: number;
}

export interface CalendarComponentProps {
  monthlySummary: MonthlySummary;
  loading: boolean;
  indexMonth: number;
}

export default function Calendar(props: CalendarProps) {
  const { loading, monthlySummary } = useCalendar(props);

  return (
    <>
      <div className="block lg:hidden">
        <CalendarMobile
          monthlySummary={monthlySummary}
          loading={loading}
          indexMonth={props.indexMonth}
        />
      </div>

      <div className="hidden lg:block">
        <CalendarDesktop
          monthlySummary={monthlySummary}
          loading={loading}
          indexMonth={props.indexMonth}
        />
      </div>
    </>
  );
}
