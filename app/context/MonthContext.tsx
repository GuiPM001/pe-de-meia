"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import "@/core/utils/date.extensions";

interface MonthContextProps {
  months: Month[];
  monthLoading: string;
  setMonths: (Months: Month[]) => void;
  getMonths: (yearSelected: number, idUser: string) => Promise<void>;
  monthSelected: Month;
  selectMonth: (month: Month) => void;
  createMonth: (idMonth: string, idUser: string, yearSelected: number) => Promise<void>;
  getLastMonth: (actualIdMonth: string, idUser: string) => Promise<Month | null>;
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
  getLastMonth: () => Promise.resolve(null)
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [monthSelected, setMonthSelected] = useState<Month>(initialState);
  const [monthLoading, setMonthLoading] = useState<string>("");

  const generateEmptyMonth = (
    indexMonth: number,
    yearSelected: number,
    idUser: string
  ) => {
    return {
      id: new Date(yearSelected, indexMonth, 1).toISODateString(),
      balance: null,
      invested: null,
      idUser: idUser,
    };
  };

  const getMonthList = (
    months: Month[],
    yearSelected: number,
    idUser: string
  ) => {
    const allMonths: Month[] = [];

    if (!months.length) {
      allMonths.push(generateEmptyMonth(0, yearSelected, idUser));
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

      allMonths.push(generateEmptyMonth(i, yearSelected, idUser));
    }

    setMonths(allMonths);
  };

  const getMonths = async (yearSelected: number, idUser: string) => {
    setMonths([]);

    const userMonths: Month[] = await api.get(`/month/get-by-id-user`, {
      params: {
        year: yearSelected,
        idUser: idUser,
      },
    });

    getMonthList(userMonths, yearSelected, idUser);
  };

  const selectMonth = (newMonth: Month) => {
    const month = months.find((x) => x.id === newMonth.id);
    if (month) setMonthSelected(month);
  }

  const getLastMonth = async (actualIdMonth: string, idUser: string) => {
    const month: Month = await api.get(`/month/get-last-month?actualIdMonth=${actualIdMonth}&idUser=${idUser}`);
    return month;
  }

  const createMonth = async (idMonth: string, idUser: string, yearSelected: number) => {
    setMonthLoading(idMonth);

    const lastMonth = await getLastMonth(idMonth, idUser);

    const newMonth: Month = {
      id: idMonth,
      idUser: idUser,
      balance: lastMonth.balance,
      invested: 0,
    };

    await api.post("/month", newMonth);

    await getMonths(yearSelected, idUser);
    setMonthLoading("");
  };

  return (
    <MonthContext.Provider value={{ months, monthLoading, setMonths, getMonths, monthSelected, selectMonth, createMonth, getLastMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => {
  const context = useContext(MonthContext);
  return context;
};
