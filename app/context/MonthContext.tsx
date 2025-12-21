"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import "@/core/utils/date.extensions";

interface MonthContextProps {
  months: Month[];
  monthLoading: string;
  setMonths: (Months: Month[]) => void;
  getMonths: (yearSelected: number, userId: string) => Promise<void>;
  monthSelected: Month;
  selectMonth: (month: Month) => void;
  createMonth: (idMonth: string, userId: string, yearSelected: number) => Promise<void>;
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
  monthLoading: "",
  setMonths: () => { },
  getMonths: () => Promise.resolve(),
  monthSelected: initialState,
  selectMonth: () => { },
  createMonth: () => Promise.resolve(),
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [monthSelected, setMonthSelected] = useState<Month>(initialState);
  const [monthLoading, setMonthLoading] = useState<string>("");

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

  const createMonth = async (idMonth: string, userId: string, yearSelected: number) => {
    setMonthLoading(idMonth);

    const realMonths = months.filter(m => m.balance !== null);
    const lastBalance = realMonths.length > 0 ? realMonths.at(-1)?.balance ?? 0 : 0;

    const newMonth: Month = {
      id: idMonth,
      idUser: userId,
      balance: lastBalance,
      invested: 0,
    };

    await api.post("/month", newMonth);

    await getMonths(yearSelected, userId);
    setMonthLoading("");
  };

  return (
    <MonthContext.Provider value={{ months, monthLoading, setMonths, getMonths, monthSelected, selectMonth, createMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => {
  const context = useContext(MonthContext);
  return context;
};
