"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight, TbCirclesFilled } from "react-icons/tb";
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
  setMonth: (month: Month) => void;
}

export default function Sidebar({
  monthSelected,
  setMonthSelected,
  yearSelected,
  setYearSelected,
  setMonth
}: SidebarProps) {
  const { profile } = useProfile();

  const [monthsResponse, setMonthsResponse] = useState<Month[]>([]);
  const [months, setMonths] = useState<Month[]>([]);
  const [monthLoading, setMonthLoading] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateEmptyMonth = useCallback(
    (indexMonth: number) => ({
      id: new Date(yearSelected, indexMonth, 1).toIsoDateString(),
      balance: null,
      idUser: profile._id,
    }),
    [profile._id, yearSelected]
  );

  const getMonthList = useCallback(
    (months: Month[]) => {
      const allMonths: Month[] = [];

      if (!months.length) {
        allMonths.push(generateEmptyMonth(0));
        setMonths(allMonths);
        return;
      }

      const firstMonth = new Date(months[0].id).getMonth();
      const lastMonth = new Date(months.at(-1)!.id).getMonth();

      for (let i = 0; i < 12; i++) {
        if (i > lastMonth + 1) break;

        if (i === firstMonth) {
          i += months.length - 1;
          allMonths.push(...months);
          continue;
        }

        allMonths.push(generateEmptyMonth(i));
      }

      setMonths(allMonths);
    },
    [generateEmptyMonth]
  );

  useEffect(() => {
    setMonths([]);
    setMonthsResponse([]);
    setLoading(true);

    const getMonths = async () => {
      const userMonths: Month[] = await api.get(`/month/get-by-id-user`, {
        params: {
          year: yearSelected,
          idUser: profile._id,
        },
      });

      setMonthsResponse(userMonths);
      getMonthList(userMonths);
      setLoading(false);
    };

    getMonths();
  }, [profile._id, yearSelected, getMonthList]);

  const createMonth = async (month: string) => {
    setMonthLoading(month);
    const lastBalance = monthsResponse.at(-1)?.balance ?? 0;

    const response: Month = await api.post("/month", {
      id: month,
      idUser: profile._id,
      balance: lastBalance,
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
        {loading && (
          <div>
            <TbCirclesFilled size="20px" className="animate-spin" />
          </div>
        )}
        {months.map((x, index) => (
          <MonthButton
            key={x.id}
            month={x}
            selected={monthSelected === index}
            savingTarget={profile.savingTarget}
            setMonthSelected={setMonthSelected}
            setMonth={setMonth}
            addMonth={createMonth}
            monthLoading={monthLoading}
          />
        ))}
      </div>
    </div>
  );
}
