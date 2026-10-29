"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import "@/core/utils/date.extensions";

interface MonthContextProps {
  months: Month[];
  monthLoading: string;
  setMonths: (Months: Month[]) => void;
  getMonths: () => Promise<Month[]>;
  monthSelected: Month;
  selectMonth: (idMonth: string) => void;
  createMonth: (
    idMonth: string,
    idUser: string
  ) => Promise<void>;
  hasPreviousMonth: (year: number, month: number) => boolean;
  hasNextMonth: (year: number, month: number) => boolean;
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
  setMonths: () => { },
  getMonths: () => Promise.resolve([]),
  monthSelected: initialState,
  selectMonth: () => { },
  createMonth: () => Promise.resolve(),
  hasPreviousMonth: () => false,
  hasNextMonth: () => false,
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);
  const [monthSelected, setMonthSelected] = useState<Month>(initialState);
  const [monthLoading, setMonthLoading] = useState<string>("");

  const getMonths = async () => {
    const userMonths: Month[] = await api.get(`/month`);

    setMonths(userMonths);
    return userMonths;
  };

  const fetchMonths = async () => {
    const userMonths = await getMonths();
    const month = userMonths.find(x => x.id === initialState.id);
    if (month) setMonthSelected(month);
  }

  useEffect(() => {
    fetchMonths();
  }, []);

  const selectMonth = (idMonth: string) => {
    const month = months.find((x) => x.id === idMonth);

    if (month) setMonthSelected(month);
  };

  const createMonth = async (
    idMonth: string,
    idUser: string
  ) => {
    if (monthLoading) return;

    setMonthLoading(idMonth);

    try {
      const userMonths = await getMonths();
      const lastMonth = userMonths
        .filter((month) => month.id < idMonth)
        .sort((a, b) => b.id.localeCompare(a.id))[0];

      const newMonth: Month = {
        id: idMonth,
        idUser: idUser,
        balance: lastMonth?.balance ?? 0,
        invested: 0,
      };

      await api.post("/month", newMonth);

      const refreshedMonths = await getMonths();
      const created = refreshedMonths.find((x) => x.id === idMonth);
      if (created) setMonthSelected(created);
    } finally {
      setMonthLoading("");
    }
  };

  const hasPreviousMonth = (year: number, month: number) => {
    const nextDate = new Date(year, month - 1, 1);
    return monthExist(nextDate);
  };

  const hasNextMonth = (year: number, month: number) => {
    const nextDate = new Date(year, month, 1);
    return monthExist(nextDate);
  };
  
  const monthExist = (date: Date) => {
    const idMonth = date.toISODateString();
    return months.some((m) => m.id === idMonth);
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
        hasPreviousMonth,
        hasNextMonth
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
