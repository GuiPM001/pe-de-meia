"use client";

import React, { useCallback, useEffect, useState } from "react";
import PaymentFlag from "./paymentFlag";
import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";
import { DayBalance } from "@/core/types/DayBalance";
import CalendarHeader from "./calendarHeader";
import TransactionsContainer from "./transactionsContainer";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import "@/core/utils/date.extensions";

interface CalendarProps {
  month: Month;
  indexMonth: number;
  year: number;
}

export default function Calendar({ month, indexMonth, year }: CalendarProps) {
  const [dayBalances, setDayBalances] = useState<DayBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastBalance, setLastBalance] = useState<number>(0);

  const { profile } = useProfile();
  const { transactions, setTransactions } = useTransaction();

  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await Promise.all([getTransactions(), getLastBalance()]);

      setLoading(false);
    };

    fetchData();
  }, [indexMonth, profile]);

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const currentDate = getStartDate();

    addDaysBefore(currentDate, dayBalances);
    addMonthlyDays(currentDate, dayBalances, transactions, lastBalance);
    completeGrid(currentDate, dayBalances);

    setDayBalances(dayBalances);
  }, [transactions]);

  const getTransactions = async () => {
    const response: Transaction[] = await api.get(
      `/transaction/get-by-id-month`,
      {
        params: {
          idMonth: month.id,
          idUser: profile._id,
        },
      }
    );

    setTransactions(response);
    return response;
  };

  const getLastBalance = async () => {
    const [y, m, d] = month.id.split("-").map(Number);

    const response: Month = await api.get(`/month/get-by-id`, {
      params: {
        idMonth: new Date(y, m - 2, d).toISODateString(),
        idUser: profile._id,
      },
    });

    setLastBalance(response?.balance ?? 0);
    return response?.balance ?? 0;
  };

  const getStartDate = useCallback(() => {
    const date = new Date(year, indexMonth, 1, 3, 0, 0);
    return new Date(year, indexMonth, 1 - date.getDay(), 3, 0, 0);
  }, [indexMonth, year]);

  const getTotalByType = (
    transactions: Transaction[],
    type: TransactionType,
    recurrent?: boolean
  ) => {
    let filtered = transactions.filter((x) => x.type === type);

    if (recurrent !== undefined)
      filtered = filtered.filter((x) => x.recurrent === recurrent);

    return filtered.reduce((acc, x) => acc + x.value, 0);
  };

  const addDay = (
    date: Date,
    balances: DayBalance[],
    values?: Partial<DayBalance>
  ) => {
    balances.push({
      day: date.getDate(),
      income: 0,
      expense: 0,
      daily: 0,
      total: null,
      ...values,
    });
  };

  const addDaysBefore = (currentDate: Date, dayBalances: DayBalance[]) => {
    while (currentDate.getUTCMonth() !== indexMonth) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const addMonthlyDays = (
    currentDate: Date,
    dayBalances: DayBalance[],
    transactions: Transaction[],
    lastBalance: number
  ) => {
    let balance = lastBalance;

    while (currentDate.getUTCMonth() === indexMonth) {
      const transactionsActual = transactions.filter(
        (x) => x.date === currentDate.toISODateString()
      );

      const todayIncome = getTotalByType(
        transactionsActual,
        TransactionType.income
      );
      const todayExpense = getTotalByType(
        transactionsActual,
        TransactionType.expense,
        true
      );
      const todayDaily = getTotalByType(
        transactionsActual,
        TransactionType.expense,
        false
      );

      const todayTotal = todayIncome - todayExpense - todayDaily;

      balance += todayTotal;

      addDay(currentDate, dayBalances, {
        income: todayIncome,
        expense: todayExpense,
        daily: todayDaily,
        total: balance,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const completeGrid = (currentDate: Date, dayBalances: DayBalance[]) => {
    while (dayBalances.length % 7 !== 0) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  if (loading) {
    return <div>CARREGANDO...</div>;
  }

  return (
    <div className="grid grid-cols-7 w-full">
      <CalendarHeader />

      {dayBalances.map((x) => (
        <div
          className="border border-gray-200 h-28"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="bg-gray-100 h-full w-full"></div>
          ) : (
            <div
              className={`h-full ${
                x.day === today.getDate() && today.getUTCMonth() === indexMonth
                  ? "border-3 border-gray-600 rounded-md"
                  : ""
              }`}
            >
              <PaymentFlag
                dayBalance={x}
                today={
                  x.day === today.getDate() &&
                  today.getUTCMonth() === indexMonth
                }
              />

              <TransactionsContainer dayBalance={x} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
