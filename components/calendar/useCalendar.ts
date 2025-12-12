import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { DayBalance } from "@/core/types/DayBalance";
import { useEffect, useMemo, useState } from "react";
import { Transaction } from "@/core/types/Transaction";
import { TransactionType } from "@/core/enums/transactionType";
import { sumValues } from "@/core/utils/sumValues";
import { CalendarProps } from ".";

export const useCalendar = ({ month }: CalendarProps) => {
  const [dayBalances, setDayBalances] = useState<DayBalance[]>([]);

  const { profile } = useProfile();
  const { transactions } = useTransaction();
  const { months } = useMonth();

  const today = new Date();
  const monthDate = useMemo(() => new Date(month.id), [month.id]);

  useEffect(() => {
    const dayBalances: DayBalance[] = [];
    const currentDate = new Date(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), 1 - monthDate.getUTCDay());

    addDaysBefore(currentDate, dayBalances);
    addMonthlyDays(currentDate, dayBalances, transactions);
    addDaysAfter(currentDate, dayBalances);

    setDayBalances(dayBalances);
  }, [transactions, month.id]);

  const getTotalByType = (transactions: Transaction[], type: TransactionType, recurrent?: boolean): Transaction[] => {
    return transactions.filter((x) => x.type === type && (recurrent === undefined || x.recurrent === recurrent));
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
      hasEstimatedDailyExpense: false,
      ...values,
    });
  };

  const addDaysBefore = (currentDate: Date, dayBalances: DayBalance[]) => {
    while (currentDate.getUTCMonth() !== monthDate.getUTCMonth()) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const addMonthlyDays = (
    currentDate: Date,
    dayBalances: DayBalance[],
    transactions: Transaction[]
  ) => {
    const indexMonth = monthDate.getUTCMonth();
    let balance = months[indexMonth - 1]?.balance ?? 0;

    while (currentDate.getUTCMonth() === indexMonth) {
      const todayTransactions = transactions.filter(
        (x) => x.date === currentDate.toISODateString()
      );

      const incomes = getTotalByType(todayTransactions, TransactionType.income);
      const expenses = getTotalByType(todayTransactions, TransactionType.expense, true);
      const dailies = getTotalByType(todayTransactions, TransactionType.expense, false);
      const investeds = getTotalByType(todayTransactions, TransactionType.investment);

      const totalInvested = sumValues(investeds);
      const todayTotal = sumValues(incomes) - sumValues(expenses) - sumValues(dailies) - totalInvested;

      balance += todayTotal;

      const hasEstimatedDailyExpense =
        currentDate.getUTCDate() >= today.getDate() &&
        currentDate.getUTCMonth() >= today.getUTCMonth() &&
        !dailies.length;

      if (hasEstimatedDailyExpense) 
        balance -= profile.dailyCost;

      addDay(currentDate, dayBalances, {
        incomes,
        expenses,
        dailies,
        investeds,
        total: balance,
        totalInvested,
        hasEstimatedDailyExpense,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const addDaysAfter = (currentDate: Date, dayBalances: DayBalance[]) => {
    while (dayBalances.length % 7 !== 0) {
      addDay(currentDate, dayBalances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const isToday = (dayBalance: DayBalance) => {
    return (
      dayBalance.day === today.getDate() &&
      today.getUTCMonth() === monthDate.getUTCMonth()
    );
  };

  return { dayBalances, isToday };
};
