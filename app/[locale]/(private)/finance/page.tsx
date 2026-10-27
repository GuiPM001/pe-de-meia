"use client";

import { useState } from "react";
import Select from "@/components/ui/select";
import MonthsGrid from "./components/monthsGrid";
import MonthSummary from "./components/monthSummary";
import FinanceSkeleton from "./components/financeSkeleton";
import { useMonth } from "@/app/context/MonthContext";

export default function FinancePage() {
  const { months } = useMonth();

  const [year, setYear] = useState<number>(new Date().getFullYear());

  const isLoading = months.length === 0;

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold w-[125%]">Finanças</h1>
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
          <MonthsGrid year={year} />
          <MonthSummary />
        </>
      )}
    </>
  );
}
