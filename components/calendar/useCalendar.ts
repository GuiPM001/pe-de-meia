import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { DayBalance, MonthlySummary } from "@/core/types/DayBalance";
import { useCallback, useEffect, useState } from "react";
import { Transaction } from "@/core/types/Transaction";
import { api } from "@/core/services/api";
import { TransactionType } from "@/core/enums/transactionType";
import { sumValues } from "@/core/utils/sumValues";
import { CalendarProps } from ".";

export const useCalendar = ({ month, indexMonth, year }: CalendarProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
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
    addMonthlyDays(currentDate, dayBalances, transactions);

    const daysRemaining = dayBalances.at(-1)!.day - today.getDate() + 1;
    const balanceRemaining = Math.max(0, month.balance! - profile.savingTarget);

    completeGrid(currentDate, dayBalances);
    setMonthlySummary({
      dayBalances,
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
      totalInvested: null,
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

      const totalInvested = sumValues(investeds);
      const todayTotal =
        sumValues(incomes) -
        sumValues(expenses) -
        sumValues(dailies) -
        totalInvested;

      balance += todayTotal;

      addDay(currentDate, dayBalances, {
        incomes,
        expenses,
        dailies,
        investeds,
        total: balance,
        totalInvested,
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

  return {
    loading,
    monthlySummary,
  };
};
