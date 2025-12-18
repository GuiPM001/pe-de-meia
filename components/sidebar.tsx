"use client";

import React, { useState } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import { useMonth } from "@/app/context/MonthContext";
import MonthButton from "./monthButton";
import YearSelect from "./yearSelect";
import LoadingSpinner from "./ui/loadingSpinner";

interface SidebarProps {
  yearSelected: number;
  handleChangeYear: (year: number) => void;
  loading: boolean;
}

export default function Sidebar({
  yearSelected,
  handleChangeYear,
  loading,
}: SidebarProps) {
  const { profile } = useProfile();

  const [monthLoading, setMonthLoading] = useState<string>("");
  const { months, getMonths, monthSelected, selectMonth } = useMonth();

  const createMonth = async (idMonth: string) => {
    setMonthLoading(idMonth);
    const lastBalance = months.at(-2)?.balance ?? 0;

    const newMonth: Month = {
      id: idMonth,
      idUser: profile._id,
      balance: lastBalance,
      invested: 0,
    };

    await api.post("/month", newMonth);

    months.pop();

    await getMonths(yearSelected, profile._id);
    setMonthLoading("");
  };

  return (
    <div className="h-full hidden lg:flex flex-col items-center">
      <YearSelect value={yearSelected} onChange={handleChangeYear} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {months.map((x) => (
            <MonthButton
              key={x.id}
              month={x}
              selected={monthSelected.id === x.id}
              savingTarget={profile.savingTarget}
              setMonth={selectMonth}
              addMonth={createMonth}
              monthLoading={monthLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
