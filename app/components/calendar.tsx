"use client";

import React, { useCallback, useEffect, useState } from "react";
import PaymentFlag from "./paymentFlag";
import monthMock from "../../__mock/months.json";
import transactionsMock from "../../__mock/transactions.json";
import { TransactionType } from "../enums/transactionType";
import { Transaction } from "../types/Transaction";
import CalendarHeader from "./calendarHeader";

interface CalendarProps {
  month: number;
}

export type DayBalance = {
  day: number;
  value: number;
};

export default function Calendar({ month }: CalendarProps) {
  const [dayBalances, setDayBalances] = useState<DayBalance[]>([]);

  const getStartDate = useCallback(() => {
    const adjustedMonth = month - 1;
    const year = new Date().getFullYear();
    const date = new Date(year, adjustedMonth, 1);

    return new Date(year, adjustedMonth, -date.getDate(), 3, 0, 0);
  }, [month]);

  const getTodayTotal = (transactions: Transaction[], date: Date) => {
    return transactions
      .filter((x) => new Date(x.date).toString() === date.toString())
      .reduce(
        (acc, x) =>
          x.type === TransactionType.income ? acc + x.value : acc - x.value,
        0
      );
  };

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const startDate = getStartDate();
    let initialBalance = monthMock.initialBalance;

    for (let i = 0; i < 35; i++) {
      const todayExpenses = getTodayTotal(transactionsMock, startDate);
      initialBalance += todayExpenses;

      dayBalances.push({
        day: startDate.getDate(),
        value: startDate.getMonth() + 1 === month ? initialBalance : 0,
      });

      startDate.setDate(startDate.getDate() + 1);
    }

    setDayBalances(dayBalances);
  }, [month, getStartDate]);

  return (
    <div className="grid grid-cols-7 w-full h-full">
      <CalendarHeader />

      {dayBalances.map((x) => (
        <>
          {x.value === 0 ? (
            <div
              className="border-1 border-gray-400 px-1 bg-gray-200"
              key={`${x.day}-0`}
            ></div>
          ) : (
            <div key={x.day} className="border-1 border-gray-400">
              <PaymentFlag dayBalance={x} />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
