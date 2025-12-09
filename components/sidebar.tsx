"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import { useTransaction } from "@/app/context/TransactionContext";
import { useMonth } from "@/app/context/MonthContext";
import MonthButton from "./monthButton";
import LoadingSpinner from "./ui/loadingSpinner";
import YearSelect from "./yearSelect";

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
  setMonth,
}: SidebarProps) {
  const { profile } = useProfile();

  const [monthLoading, setMonthLoading] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { transactions } = useTransaction();
  const { months, getMonths } = useMonth();

  useEffect(() => {
    if (!profile._id) return;

    const fetchMonths = async () => {
      setLoading(true);
      await getMonths(yearSelected, profile._id);
      setLoading(false);
    };

    fetchMonths();
  }, [profile._id, yearSelected, transactions]);

  const createMonth = async (idMonth: string) => {
    setMonthLoading(idMonth);
    const lastBalance = months.at(-2)?.balance ?? 0;
    const [year, month] = idMonth.split('-').map(Number);
    const qtdDays = new Date(year, month, 0).getDate();

    const newMonth: Month = {
      id: idMonth,
      idUser: profile._id,
      balance: lastBalance - (qtdDays * profile.dailyCost),
      invested: 0
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
        {loading && <LoadingSpinner />}
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
