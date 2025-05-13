"use client";

import React, { useCallback, useEffect, useState } from "react";
import PaymentFlag from "./paymentFlag";
import transactionsMock from "../__mock/transactions.json";
import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";
import { DayBalance } from "@/core/types/DayBalance";
import CalendarHeader from "./calendarHeader";
import TransactionsContainer from "./transactionsContainer";
import { Month } from "@/core/types/Month";

interface CalendarProps {
  month: Month;
  indexMonth: number;
  year: number;
}

export default function Calendar({ month, indexMonth, year }: CalendarProps) {
  const [dayBalances, setDayBalances] = useState<DayBalance[]>([]);

  const today = new Date();

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const currentDate = getStartDate();

    addDaysBefore(currentDate, dayBalances);
    addMonthlyDays(currentDate, dayBalances);
    completeGrid(currentDate, dayBalances);

    setDayBalances(dayBalances);
  }, [indexMonth]);

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
      filtered = filtered.filter((x) => x.recurrent == recurrent);

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
    while (currentDate.getMonth() !== indexMonth) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const addMonthlyDays = (currentDate: Date, dayBalances: DayBalance[]) => {
    let balance = month.balance ?? 0;

    while (currentDate.getMonth() === indexMonth) {
      const transactions = transactionsMock.filter(
        (x) => new Date(x.date).toDateString() === currentDate.toDateString()
      );

      const todayIncome = getTotalByType(transactions, TransactionType.income);
      const todayExpense = getTotalByType(
        transactions,
        TransactionType.expense,
        true
      );
      const todayDaily = getTotalByType(
        transactions,
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
                x.day === today.getDate() && today.getMonth() === indexMonth
                  ? "border-3 border-gray-600 rounded-md"
                  : ""
              }`}
            >
              <PaymentFlag
                dayBalance={x}
                today={
                  x.day === today.getDate() && today.getMonth() === indexMonth
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
