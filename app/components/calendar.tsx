"use client";

import React, { useCallback, useEffect, useState } from "react";
import PaymentFlag from "./paymentFlag";
import monthMock from "../../__mock/months.json";
import transactionsMock from "../../__mock/transactions.json";
import { TransactionType } from "../enums/transactionType";
import { Transaction } from "../types/Transaction";
import CalendarHeader from "./calendarHeader";
import { DayBalance } from "../types/DayBalance";
import TransactionsContainer from "./transactionsContainer";

interface CalendarProps {
  month: number;
}

export default function Calendar({ month }: CalendarProps) {
  const [dayBalances, setDayBalances] = useState<DayBalance[]>([]);

  const getStartDate = useCallback(() => {
    const adjustedMonth = month - 1;
    const year = new Date().getFullYear();
    const date = new Date(year, adjustedMonth, 1);

    return new Date(year, adjustedMonth, -date.getDate(), 3, 0, 0);
  }, [month]);

  const getTodayTotal = (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, x) =>
        x.type === TransactionType.income ? acc + x.value : acc - x.value,
      0
    );
  };

  const getTotalByType = (
    transactions: Transaction[],
    transactionType: TransactionType
  ) => {
    return transactions
      .filter((x) => x.type === transactionType)
      .reduce((acc, x) => acc + x.value, 0);
  };

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const startDate = getStartDate();
    let initialBalance = monthMock.initialBalance;

    for (let i = 0; i < 35; i++) {
      const transactions = transactionsMock.filter(
        (x) => new Date(x.date).toString() === startDate.toString()
      );

      const todayExpenses = getTodayTotal(transactions);

      initialBalance += todayExpenses;

      dayBalances.push({
        day: startDate.getDate(),
        income: getTotalByType(transactions, TransactionType.income),
        expense: getTotalByType(transactions, TransactionType.expense),
        daily: getTotalByType(transactions, TransactionType.daily),
        total: startDate.getMonth() + 1 === month ? initialBalance : null,
      });

      startDate.setDate(startDate.getDate() + 1);
    }

    setDayBalances(dayBalances);
  }, [month, getStartDate]);

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
            <>
              <PaymentFlag dayBalance={x} />

              <TransactionsContainer dayBalance={x} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
