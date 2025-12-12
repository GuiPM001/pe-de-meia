"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import "@/core/utils/date.extensions";

interface MonthContextProps {
  months: Month[];
  setMonths: (Months: Month[]) => void;
  getMonths: (yearSelected: number, userId: string) => Promise<void>;
  monthSelected: Month;
  selectMonth: (month: Month) => void;
}

const initialState: Month = {
  idUser: "",
  balance: 0,
  invested: 0,
  id: new Date(
    new Date().getFullYear(),
    new Date().getUTCMonth(),
    1
  ).toISODateString(),
};

const MonthContext = createContext<MonthContextProps>({
  months: [],
  setMonths: () => {},
  getMonths: () => Promise.resolve(),
  monthSelected: initialState,
  selectMonth: () => {},
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [monthSelected, setMonthSelected] = useState<Month>(initialState);

  const generateEmptyMonth = (
    indexMonth: number,
    yearSelected: number,
    userId: string
  ) => {
    return {
      id: new Date(yearSelected, indexMonth, 1).toISODateString(),
      balance: null,
      invested: null,
      idUser: userId,
    };
  };

  const getMonthList = (
    months: Month[],
    yearSelected: number,
    userId: string
  ) => {
    const allMonths: Month[] = [];

    if (!months.length) {
      allMonths.push(generateEmptyMonth(0, yearSelected, userId));
      setMonths(allMonths);
      return;
    }

    const firstMonth = new Date(months[0].id).getUTCMonth();
    const lastMonth = new Date(months.at(-1)!.id).getUTCMonth();

    for (let i = 0; i < 12; i++) {
      if (i > lastMonth + 1) break;

      if (i === firstMonth) {
        allMonths.push(...months);
        i += months.length - 1;
        continue;
      }

      allMonths.push(generateEmptyMonth(i, yearSelected, userId));
    }

    setMonths(allMonths);
  };

  const getMonths = async (yearSelected: number, userId: string) => {
    setMonths([]);

    const userMonths: Month[] = await api.get(`/month/get-by-id-user`, {
      params: {
        year: yearSelected,
        idUser: userId,
      },
    });

    getMonthList(userMonths, yearSelected, userId);
  };

  const selectMonth = (newMonth: Month) => {
    const month = months.find((x) => x.id === newMonth.id);
    if (month) setMonthSelected(month);
  }

  return (
    <MonthContext.Provider value={{ months, setMonths, getMonths, monthSelected, selectMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => {
  const context = useContext(MonthContext);
  return context;
};
