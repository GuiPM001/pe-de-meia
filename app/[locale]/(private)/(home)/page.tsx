"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/calendar";
import Sidebar from "@/components/sidebar";
import { Month } from "@/core/types/Month";
import { TransactionProvider } from "@/app/context/TransactionContext";
import Header from "@/components/header";
import { TransactionModalProvider } from "@/app/context/TransactionModalContext";
import "@/core/utils/date.extensions";
import Wrapper from "@/components/ui/wrapper";
import { useMonth } from "@/app/context/MonthContext";

export default function Home() {
  const today = new Date();
  
  const { months } = useMonth();

  const [indexMonth, setIndexMonth] = useState<number>(today.getUTCMonth());
  const [yearSelected, setYearSelected] = useState<number>(today.getFullYear());
  const [monthSelected, setMonthSelected] = useState<Month>({
    balance: 0,
    invested: 0,
    id: new Date(yearSelected, indexMonth, 1).toISODateString(),
    idUser: "",
  });

  useEffect(() => {
    const month = months.find((x) => x.id === monthSelected.id);
    if (month) setMonthSelected(month);
  }, [months, monthSelected.id]);

  return (
    <TransactionProvider>
      <TransactionModalProvider>
        <Wrapper>
          <div className="flex flex-row gap-8">
            <Sidebar
              monthSelected={indexMonth}
              setMonthSelected={setIndexMonth}
              yearSelected={yearSelected}
              setYearSelected={setYearSelected}
              setMonth={setMonthSelected}
            />

            <div className="flex flex-col w-full h-full">
              <Header
                yearSelected={yearSelected}
                indexMonthSelected={indexMonth}
                month={monthSelected}
              />

              <Calendar
                month={monthSelected}
                indexMonth={indexMonth}
                year={yearSelected}
              />
            </div>
          </div>
        </Wrapper>
      </TransactionModalProvider>
    </TransactionProvider>
  );
}
