import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { DayBalance } from "@/core/types/DayBalance";
import { useEffect, useMemo, useState } from "react";
import { Transaction } from "@/core/types/Transaction";
import { TransactionType } from "@/core/enums/transactionType";
import { sumValues } from "@/core/utils/sumValues";
import { getFirstCalendarDate, getFirstDayOfMonth } from "@/core/utils/date";

export const useCalendar = () => {
  const { profile } = useProfile();
  const { transactions } = useTransaction();
  const { monthSelected, getLastMonth } = useMonth();

  const today = new Date();

  const monthDate = useMemo(
    () => new Date(monthSelected.id),
    [monthSelected.id]
  );

  const [dayBalances, setDayBalances] = useState(createSkeletonCalendar);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setIsCalculating(true);
    setDayBalances(createSkeletonCalendar(monthDate));
  }, [monthDate]);

  useEffect(() => {
    if (transactions.length === 0) return;
    createCalendar();
  }, [transactions, monthSelected.id]);

  function addDay(date: Date, balances: DayBalance[], values?: Partial<DayBalance>) {
    balances.push({
      day: date.getDate(),
      idMonth: monthSelected.id,
      incomes: null,
      expenses: null,
      dailies: null,
      investeds: null,
      total: null,
      totalInvested: null,
      hasEstimatedDailyExpense: false,
      ...values,
    });
  }

  function addDaysBeforeMonth(currentDate: Date, balances: DayBalance[]) {
    while (currentDate.getUTCMonth() !== monthDate.getUTCMonth()) {
      addDay(currentDate, balances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  function addDaysAfterMonth(currentDate: Date, balances: DayBalance[]) {
    while (balances.length % 7 !== 0) {
      addDay(currentDate, balances);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  function groupTransactions(transactions: Transaction[]) {
    const incomes: Transaction[] = [];
    const expenses: Transaction[] = [];
    const dailies: Transaction[] = [];
    const investeds: Transaction[] = [];

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.income) {
        incomes.push(transaction);
        continue;
      }

      if (transaction.type === TransactionType.investment) {
        investeds.push(transaction);
        continue;
      }

      if (transaction.type === TransactionType.expense &&transaction.recurrent) {
        expenses.push(transaction);
        continue;
      }

      dailies.push(transaction);
    }

    return { incomes, expenses, dailies, investeds };
  }

  function createSkeletonCalendar(monthDate?: Date): DayBalance[] {
    let actualMonth = getFirstDayOfMonth(today);
    if (monthDate) actualMonth = monthDate;

    const skeleton: DayBalance[] = [];
    const currentDate = getFirstCalendarDate(actualMonth);

    addDaysBeforeMonth(currentDate, skeleton);

    while (currentDate.getUTCMonth() === actualMonth.getUTCMonth()) {
      addDay(currentDate, skeleton, { total: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    addDaysAfterMonth(currentDate, skeleton);

    return skeleton;
  }

  async function createCalendar() {
    setIsCalculating(true);

    const balances: DayBalance[] = [];
    const currentDate = getFirstCalendarDate(monthDate);

    addDaysBeforeMonth(currentDate, balances);
    await addMonthlyDays(currentDate, balances);
    addDaysAfterMonth(currentDate, balances);

    setDayBalances(balances);
    setIsCalculating(false);
  }

  async function addMonthlyDays(currentDate: Date, balances: DayBalance[]) {
    const indexMonth = monthDate.getUTCMonth();
     
    const lastMonth = await getLastMonth(monthSelected.id, profile._id);
    let balance = lastMonth?.balance ?? 0;

    while (currentDate.getUTCMonth() === indexMonth) {
      const dailyTransactions = transactions.filter(
        (x) => x.date === currentDate.toISODateString()
      );

      const { incomes, expenses, dailies, investeds } = groupTransactions(dailyTransactions);

      const totalInvested = sumValues(investeds);
      const todayTotal = sumValues(incomes) - sumValues(expenses) - sumValues(dailies) - totalInvested;

      balance += todayTotal;

      const hasEstimatedDailyExpense = currentDate.toISODateString() >= today.toISODateString();

      if (hasEstimatedDailyExpense)
        balance -= profile.dailyCost;

      addDay(currentDate, balances, {
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
  }

  const isToday = (dayBalance: DayBalance) =>
    dayBalance.day === today.getDate() &&
    today.getUTCMonth() === monthDate.getUTCMonth();

  return { dayBalances, isCalculating, isToday };
};
