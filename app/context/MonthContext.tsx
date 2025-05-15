"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Month } from "@/core/types/Month";

interface MonthContextProps {
  months: Month[];
  setMonths: (Months: Month[]) => void;
}

const MonthContext = createContext<MonthContextProps>({
  months: [],
  setMonths: () => {},
});

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [months, setMonths] = useState<Month[]>([]);

  return (
    <MonthContext.Provider value={{ months, setMonths }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => {
  const context = useContext(MonthContext);
  return context;
};
