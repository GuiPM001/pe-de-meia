"use client";

import React, { useCallback, useEffect, useState } from "react";
import DayBalanceFlag from "./dayBalanceFlag";
import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";
import { DayBalance, MonthlySummary } from "@/core/types/DayBalance";
import CalendarHeader from "./calendarHeader";
import TransactionsContainer from "./transactionsContainer";
import { Month } from "@/core/types/Month";
import { api } from "@/core/services/api";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { useMonth } from "@/app/context/MonthContext";
import { sumValues } from "@/core/utils/sumValues";
import { currencyNumber } from "@/core/utils/numberFormat";
import "@/core/utils/date.extensions";

interface CalendarProps {
  month: Month;
  indexMonth: number;
  year: number;
}

export default function Calendar({ month, indexMonth, year }: CalendarProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    totalInvested: 0,
    dayBalances: [],
    remainingDailyExpenses: 0,
  });

  const { profile } = useProfile();
  const { transactions, setTransactions } = useTransaction();
  const { months } = useMonth();

  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      if (!profile._id) return;

      setLoading(true);

      const transactions = await getTransactions();

      setTransactions(transactions);
      setLoading(false);
    };

    fetchData();
  }, [indexMonth, profile]);

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const currentDate = getStartDate();

    addDaysBefore(currentDate, dayBalances);
    const totalInvested = addMonthlyDays(
      currentDate,
      dayBalances,
      transactions
    );

    const daysRemaining = dayBalances.at(-1)!.day - today.getDate() + 1;
    const balanceRemaining = Math.max(0, month.balance! - profile.savingTarget);

    completeGrid(currentDate, dayBalances);
    setMonthlySummary({
      dayBalances,
      totalInvested,
      remainingDailyExpenses: balanceRemaining / daysRemaining,
    });
  }, [transactions, month.balance, profile.savingTarget]);

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

    return response;
  };

  const getStartDate = useCallback(() => {
    const date = new Date(year, indexMonth, 1, 3, 0, 0);
    return new Date(year, indexMonth, 1 - date.getDay(), 3, 0, 0);
  }, [indexMonth, year]);

  const getTotalByType = (
    transactions: Transaction[],
    type: TransactionType,
    recurrent?: boolean
  ): Transaction[] => {
    let filtered = transactions.filter((x) => x.type === type);

    if (recurrent !== undefined)
      filtered = filtered.filter((x) => x.recurrent === recurrent);

    return filtered;
  };

  const addDay = (
    date: Date,
    balances: DayBalance[],
    values?: Partial<DayBalance>
  ) => {
    balances.push({
      day: date.getDate(),
      idMonth: month.id,
      incomes: null,
      expenses: null,
      dailies: null,
      investeds: null,
      total: null,
      description: "",
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
    transactions: Transaction[]
  ) => {
    let balance = months[indexMonth - 1]?.balance ?? 0;
    let totalInvested = 0;

    while (currentDate.getUTCMonth() === indexMonth) {
      const transactionsActual = transactions.filter(
        (x) => x.date === currentDate.toISODateString()
      );

      const incomes = getTotalByType(
        transactionsActual,
        TransactionType.income
      );
      const expenses = getTotalByType(
        transactionsActual,
        TransactionType.expense,
        true
      );
      const dailies = getTotalByType(
        transactionsActual,
        TransactionType.expense,
        false
      );
      const investeds = getTotalByType(
        transactionsActual,
        TransactionType.investment
      );

      const investedToday = sumValues(investeds);
      const todayTotal =
        sumValues(incomes) -
        sumValues(expenses) -
        sumValues(dailies) -
        investedToday;

      balance += todayTotal;
      totalInvested += investedToday;

      addDay(currentDate, dayBalances, {
        incomes,
        expenses,
        dailies,
        investeds,
        total: balance,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalInvested;
  };

  const completeGrid = (currentDate: Date, dayBalances: DayBalance[]) => {
    while (dayBalances.length % 7 !== 0) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  return (
    <div className="grid grid-cols-7 w-full">
      <CalendarHeader dayBalances={monthlySummary.dayBalances} />

      {monthlySummary.dayBalances.map((x) => (
        <div
          className="border border-gray-200 h-30 relative"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="bg-gray-100 h-full w-full"></div>
          ) : (
            <div
              className={`h-full group ${
                x.day === today.getDate() && today.getUTCMonth() === indexMonth
                  ? "border-3 border-gray-600 rounded-md"
                  : ""
              }`}
            >
              <DayBalanceFlag
                loading={loading}
                dayBalance={x}
                totalInvested={monthlySummary.totalInvested}
                today={
                  x.day === today.getDate() &&
                  today.getUTCMonth() === indexMonth
                }
              />

              <TransactionsContainer dayBalance={x} />

              {new Date(year, indexMonth, x.day, 23, 59, 59) >= today && (
                <span className="absolute bottom-[4px] right-[8px] text-sm font-bold text-gray-300 z-0">
                  {currencyNumber(monthlySummary.remainingDailyExpenses)}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
