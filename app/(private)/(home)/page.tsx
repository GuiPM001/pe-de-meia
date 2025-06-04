"use client";

import { useState } from "react";
import Calendar from "@/components/calendar";
import Sidebar from "@/components/sidebar";
import { Month } from "@/core/types/Month";
import { TransactionProvider } from "@/app/context/TransactionContext";
import Header from "@/components/header";
import { TransactionModalProvider } from "@/app/context/TransactionModalContext";
import "@/core/utils/date.extensions";
import Wrapper from "@/components/ui/wrapper";

export default function Home() {
  const [indexMonthSelected, setIndexMonthSelected] = useState<number>(
    new Date().getUTCMonth()
  );

  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  );

  const [monthSelected, setMonthSelected] = useState<Month>({
    balance: 0,
    invested: 0,
    id: new Date(yearSelected, indexMonthSelected, 1).toISODateString(),
    idUser: "",
  });

  return (
    <TransactionProvider>
      <TransactionModalProvider>
        <Wrapper>
          <div className="flex flex-row">
            <Sidebar
              monthSelected={indexMonthSelected}
              setMonthSelected={setIndexMonthSelected}
              yearSelected={yearSelected}
              setYearSelected={setYearSelected}
              setMonth={setMonthSelected}
            />

            <div className="flex flex-col w-full h-full">
              <Header
                yearSelected={yearSelected}
                indexMonthSelected={indexMonthSelected}
                month={monthSelected}
              />

              <Calendar
                month={monthSelected}
                indexMonth={indexMonthSelected}
                year={yearSelected}
              />
            </div>
          </div>
        </Wrapper>
      </TransactionModalProvider>
    </TransactionProvider>
  );
}
