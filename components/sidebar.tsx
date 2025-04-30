"use client";

import React from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import monthsMock from "../__mock/months.json";
import { getColors } from "@/core/utils/getColors";
import { getMonthNameByDate } from "@/core/utils/date";
import { useProfile } from "@/app/context/ProfileContext";
import IconButton from "./core/iconButton";

interface SidebarProps {
  monthSelected: number;
  setMonthSelected: (month: number) => void;
  yearSelected: number;
  setYearSelected: (year: number) => void;
}

export default function Sidebar({
  monthSelected,
  setMonthSelected,
  yearSelected,
  setYearSelected,
}: SidebarProps) {
  const { profile } = useProfile();

  return (
    <div className="w-80 h-full flex flex-col items-center">
      <div className="flex flex-row items-center gap-2 mb-10">
        <IconButton onClick={() => setYearSelected(yearSelected - 1)}>
          <TbChevronLeft size="24px" />
        </IconButton>

        <span className="text-5xl font-black">{yearSelected}</span>

        <IconButton onClick={() => setYearSelected(yearSelected + 1)}>
          <TbChevronRight size="24px" />
        </IconButton>
      </div>

      <div>
        {monthsMock.map((x, index) => (
          <button
            key={x.month}
            onClick={() => setMonthSelected(index)}
            className={`capitalize w-24 py-1 px-2 mb-2 rounded-md flex justify-center cursor-pointer
              ${monthSelected === index ? "font-bold" : "font-semibold"}
              ${getColors(
                x.finalBalance,
                profile.savingTarget,
                monthSelected === index
              )}`}
          >
            <span>{getMonthNameByDate(x.month)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
