"use client";

import { useState } from "react";
import Wrapper from "@/components/ui/wrapper";
import Select from "@/components/ui/select";
import MonthsGrid from "./components/monthsGrid";
import MonthSummary from "./components/monthSummary";
import FinanceSkeleton from "./components/financeSkeleton";
import { GoalStatus } from "@/core/utils/goalStyle";
import { useProfile } from "@/app/context/ProfileContext";
import { useMonth } from "@/app/context/MonthContext";
import { Month } from "@/core/types/Month";
import { MonthAvailability } from "./finance.types";

export default function FinancePage() {
  const { profile } = useProfile();
  const { months } = useMonth();

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const getGoalStatus = (
    month: Month | undefined,
    availability: MonthAvailability,
  ): GoalStatus => {
    if (availability === "creatable" || availability === "disabled")
      return availability;

    if (!month || month.balance! < 0) return "negative";

    const date = new Date(`${month.id}T12:00:00`);
    const now = new Date();

    if (date.getMonth() > now.getMonth() && month.balance! > profile.savingTarget)
      return "above";

    if (month.invested! < profile.savingTarget) return "below";

    return "above";
  };

  const isLoading = months.length === 0;

  return (
    <Wrapper>
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Finanças</h1>
        <Select
          label=""
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          options={[
            { label: `${year + 1}`, value: year + 1 },
            { label: `${year}`, value: year },
            { label: `${year - 1}`, value: year - 1 },
          ]}
        />
      </header>

      {isLoading ? (
        <FinanceSkeleton />
      ) : (
        <>
          <MonthsGrid year={year} getGoalStatus={getGoalStatus} />
          <MonthSummary getGoalStatus={getGoalStatus} />
        </>
      )}
    </Wrapper>
  );
}
