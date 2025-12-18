import React from "react";
import CalendarMobile from "./calendarMobile";
import CalendarDesktop from "./calendarDesktop";

export interface CalendarProps {
  loading: boolean;
}

export default function Calendar(props: CalendarProps) {
  return (
    <>
      <div className="block lg:hidden">
        <CalendarMobile {...props} />
      </div>

      <div className="hidden lg:block">
        <CalendarDesktop {...props} />
      </div>
    </>
  );
}
