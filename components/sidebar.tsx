"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useProfile } from "@/app/context/ProfileContext";
import IconButton from "./ui/iconButton";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import MonthButton from "./monthButton";

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

  const [monthsResponse, setMonthsResponse] = useState<Month[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [monthLoading, setMonthLoading] = useState<string>("");

  const getMonthList = useCallback(
    (months: Month[]) => {
      const allMonths: Month[] = [];
      const firstMonth = new Date(months[0].id).getMonth();
      const lastMonth = new Date(months[months.length - 1].id).getMonth();

      for (let i = 0; i < 12; i++) {
        if (i > lastMonth + 1) continue;

        if (i === firstMonth) {
          i += months.length - 1;
          allMonths.push(...months);
          continue;
        }

        allMonths.push({
          id: new Date(yearSelected, i, 1).toISOString(),
          balance: null,
          idUser: profile._id,
        });
      }

      setMonths(allMonths);
    },
    [yearSelected, profile._id]
  );

  useEffect(() => {
    const getMonths = async () => {
      const userMonths: Month[] = await api.get(`/month/get-by-id-user`, {
        params: {
          year: yearSelected,
          idUser: profile._id,
        },
      });

      setMonthsResponse(userMonths);
      getMonthList(userMonths);
    };

    getMonths();
  }, [profile._id, yearSelected, getMonthList]);

  const addMonth = async (month: string) => {
    setMonthLoading(month);
    const response: Month = await api.post("/month", {
      id: month,
      balance: monthsResponse[monthsResponse.length - 1].balance,
      idUser: profile._id,
    });

    const newMonths = [...monthsResponse, response];
    setMonthsResponse(newMonths);
    getMonthList(newMonths);
    setMonthLoading("");
  };

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
        {months.map((x, index) => (
          <MonthButton
            key={x.id}
            month={x}
            selected={monthSelected === index}
            savingTarget={profile.savingTarget}
            setMonthSelected={setMonthSelected}
            addMonth={addMonth}
            monthLoading={monthLoading}
          />
        ))}
      </div>
    </div>
  );
}
