"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Transaction } from "@/core/types/Transaction";

interface TransactionContextProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const TransactionContext = createContext<TransactionContextProps>({
  transactions: [],
  setTransactions: () => {},
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
