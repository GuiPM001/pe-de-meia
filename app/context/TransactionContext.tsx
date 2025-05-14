"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Transaction } from "@/core/types/Transaction";

interface TransactionContextProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const initialState: Transaction[] = [];

const TransactionContext = createContext<TransactionContextProps>({
  transactions: initialState,
  setTransactions: () => {},
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialState);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  return context;
};
