"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Transaction } from "@/core/types/Transaction";
import { api } from "@/core/services/api";
import axios from "axios";

interface TransactionContextProps {
  transactions: Transaction[] | null;
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  getTransactions: (
    idMonth: string,
    idUser: string,
    signal?: AbortSignal,
  ) => Promise<void>;
  cancelTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextProps>({
  transactions: null,
  isLoading: false,
  setTransactions: () => {},
  getTransactions: async () => {},
  cancelTransactions: () => {},
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelTransactions = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const getTransactions = useCallback(
    async (idMonth: string, idUser: string, signal?: AbortSignal) => {
      // Abort any pending transaction fetch
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Propagate abort from external signal if provided
      if (signal) {
        if (signal.aborted) {
          controller.abort(signal.reason);
        } else {
          signal.addEventListener(
            "abort",
            () => controller.abort(signal.reason),
            { once: true },
          );
        }
      }

      setTransactions(null);
      setIsLoading(true);

      try {
        const response: Transaction[] = await api.get(
          `/transaction/get-by-id-month`,
          {
            params: {
              idMonth,
              idUser,
            },
            signal: controller.signal,
          },
        );

        if (!controller.signal.aborted) {
          setTransactions(response);
          setIsLoading(false);
        }
      } catch (error: any) {
        const isCanceled =
          axios.isCancel(error) ||
          controller.signal.aborted ||
          error?.name === "AbortError" ||
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED";

        if (isCanceled) {
          return;
        }

        setIsLoading(false);
        console.error("Failed to load transactions", error);
        throw error;
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        setTransactions,
        getTransactions,
        cancelTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  return context;
};
