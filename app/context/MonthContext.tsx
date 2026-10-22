"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import "@/core/utils/date.extensions";

interface MonthContextProps {
  months: Month[];
  monthLoading: string;
  setMonths: (Months: Month[]) => void;
  getMonths: (idUser: string) => Promise<void>;
  monthSelected: Month;
  selectMonth: (idMonth: string) => void;
  createMonth: (
    idMonth: string,
    idUser: string,
    yearSelected: number,
  ) => Promise<void>;
  getLastMonth: (
    actualIdMonth: string,
    idUser: string,
  ) => Promise<Month | null>;
}

const initialState: Month = {
  idUser: "",
  balance: 0,
  invested: 0,
  id: new Date(
    new Date().getFullYear(),
    new Date().getUTCMonth(),
    1,
  ).toISODateString(),
};

const MonthContext = createContext<MonthContextProps>({
  months: [],
  monthLoading: "",
  setMonths: () => {},
  getMonths: () => Promise.resolve(),
  monthSelected: initialState,
  selectMonth: () => {},
  createMonth: () => Promise.resolve(),
  getLastMonth: () => Promise.resolve(null),
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [monthSelected, setMonthSelected] = useState<Month>(initialState);
  const [monthLoading, setMonthLoading] = useState<string>("");

  const getMonths = async (idUser: string) => {
    setMonths([]);

    const userMonths: Month[] = await api.get(`/month/get-by-id-user`, {
      params: {
        idUser: idUser,
      },
    });

    setMonths(userMonths);
  };

  const selectMonth = (idMonth: string) => {
    const month = months.find((x) => x.id === idMonth);

    if (month) setMonthSelected(month);
  };

  const getLastMonth = async (actualIdMonth: string, idUser: string) => {
    const month: Month = await api.get(
      `/month/get-last-month?actualIdMonth=${actualIdMonth}&idUser=${idUser}`,
    );
    return month;
  };

  const createMonth = async (
    idMonth: string,
    idUser: string,
    yearSelected: number,
  ) => {
    setMonthLoading(idMonth);

    const lastMonth = await getLastMonth(idMonth, idUser);

    const newMonth: Month = {
      id: idMonth,
      idUser: idUser,
      balance: lastMonth.balance,
      invested: 0,
    };

    await api.post("/month", newMonth);

    await getMonths(idUser);
    setMonthLoading("");
  };

  return (
    <MonthContext.Provider
      value={{
        months,
        monthLoading,
        setMonths,
        getMonths,
        monthSelected,
        selectMonth,
        createMonth,
        getLastMonth,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => {
  const context = useContext(MonthContext);
  return context;
};
