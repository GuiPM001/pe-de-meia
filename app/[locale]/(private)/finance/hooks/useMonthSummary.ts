"use client";

import { useMemo } from "react";
import { useTransaction } from "@/app/context/TransactionContext";
import { getDaysFromMonthId } from "@/core/utils/date";
import { TransactionType } from "@/core/enums/transactionType";

export function useMonthSummary() {
  const { transactions, isLoading } = useTransaction();

  const totalsByType = useMemo(() => {
    const totals: Record<number, number> = {};
    transactions?.forEach((tx) => {
      totals[tx.type] = (totals[tx.type] ?? 0) + (tx.value ?? 0);
    });
    return totals;
  }, [transactions]);

  const hasDailyTransactionToday = useMemo(() => {
    const today = new Date().toISODateString();
    return transactions?.some(t => t.date ===  today && t.type === TransactionType.daily);
  }, [transactions]);

  const getRealizedDays = (daysInMonth: number, selectedIndex: number, currentIndex: number) => {
    if (selectedIndex > currentIndex)
      return 0;

    if (selectedIndex < currentIndex)
      return daysInMonth;

    return new Date().getDate();
  }

  const getMonthDays = (monthId?: string) => {
    if (!monthId) {
      return {
        year: 0,
        daysInMonth: 0,
        realizedDays: 0,
        futureDays: 0,
        isCurrentMonth: false,
      };
    }

    const [year, month] = monthId.split("-").map(Number);
    const daysInMonth = getDaysFromMonthId(monthId);

    const now = new Date();
    const selectedIndex = year * 12 + month;
    const currentIndex = now.getFullYear() * 12 + now.getMonth() + 1;

    const realizedDays = getRealizedDays(daysInMonth, selectedIndex, currentIndex);

    return {
      year,
      daysInMonth,
      realizedDays,
      futureDays: Math.max(0, daysInMonth - realizedDays),
      isCurrentMonth: selectedIndex === currentIndex,
    };
  };

  return { totalsByType, isLoading, hasDailyTransactionToday, getMonthDays };
}
