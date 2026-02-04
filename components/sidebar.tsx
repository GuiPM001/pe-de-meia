"use client";

import React from "react";
import { useProfile } from "@/app/context/ProfileContext";
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

  const { months, monthSelected, selectMonth, createMonth, monthLoading } = useMonth();

  const handleCreateMonth = async (idMonth: string) => {
    await createMonth(idMonth, profile._id, yearSelected);
  }

  return (
    <div className="hidden lg:flex flex-col items-center bg-white rounded-2xl border border-gray-200 p-6 min-w-50 shadow-sm">
      <YearSelect value={yearSelected} onChange={handleChangeYear} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {months.map((x) => (
            <MonthButton
              key={x.id}
              month={x}
              selected={monthSelected.id === x.id}
              savingTarget={profile.savingTarget}
              setMonth={selectMonth}
              addMonth={handleCreateMonth}
              monthLoading={monthLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
