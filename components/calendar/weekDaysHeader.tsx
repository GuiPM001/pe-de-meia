import { getWeekDays } from "@/core/utils/date";
import React from "react";

export default function WeekDaysHeader() {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {getWeekDays("narrow").map((day, index) => (
        <div
          key={index}
          className="text-center text-sm font-medium text-gray-500 py-2"
        >
          {day}
        </div>
      ))}
    </div>
  );
}
