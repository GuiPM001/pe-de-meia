"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Transaction } from "@/core/types/Transaction";
import { api } from "@/core/services/api";

interface TransactionContextProps {
  transactions: Transaction[] | null;
  setTransactions: (transactions: Transaction[]) => void;
  getTransactions: (idMonth: string, idUser: string) => void;
}

const TransactionContext = createContext<TransactionContextProps>({
  transactions: [],
  setTransactions: () => {},
  getTransactions: () => {},
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  const getTransactions = async (idMonth: string, idUser: string) => {
    setTransactions(null);
    const response: Transaction[] = await api.get(
      `/transaction/get-by-id-month`,
      {
        params: {
          idMonth: idMonth,
          idUser: idUser,
        },
      }
    );

    setTransactions(response);
  };

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, getTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  return context;
};
