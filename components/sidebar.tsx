"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import { useTransaction } from "@/app/context/TransactionContext";
import { useMonth } from "@/app/context/MonthContext";
import MonthButton from "./monthButton";
import YearSelect from "./yearSelect";

interface SidebarProps {
  yearSelected: number;
  setYearSelected: (year: number) => void;
}

export default function Sidebar({
  yearSelected,
  setYearSelected,
}: SidebarProps) {
  const { profile } = useProfile();

  const [monthLoading, setMonthLoading] = useState<string>("");

  const { transactions } = useTransaction();
  const { months, getMonths, monthSelected, selectMonth } = useMonth();

  useEffect(() => {
    getMonths(yearSelected, profile._id);
  }, [profile._id, yearSelected, transactions]);

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
      <YearSelect value={yearSelected} onChange={setYearSelected} />

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
    </div>
  );
}
