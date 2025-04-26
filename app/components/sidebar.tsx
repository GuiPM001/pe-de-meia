"use client";

import React from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { IconButton } from "@chakra-ui/react";
import monthsMock from "../../__mock/months.json";
import { getColors } from "../utils/getColors";
import { getMonthNameByDate } from "../utils/date";
import { useProfile } from "../context/ProfileContext";

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
        <IconButton
          aria-label="Previous year"
          fontSize="24px"
          onClick={() => setYearSelected(yearSelected - 1)}
          icon={<TbChevronLeft />}
        />

        <span className="text-5xl font-black">{yearSelected}</span>

        <IconButton
          aria-label="Next year"
          fontSize="24px"
          onClick={() => setYearSelected(yearSelected + 1)}
          icon={<TbChevronRight />}
        />
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
