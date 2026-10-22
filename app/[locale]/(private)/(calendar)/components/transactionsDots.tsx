import React from "react";
import { DayBalance } from "@/core/types/DayBalance";
import { TransactionType } from "@/core/enums/transactionType";

interface TransactionsDotsProps {
  day: DayBalance;
}

export default function TransactionsDots({ day }: TransactionsDotsProps) {
  const indicators = [];

  const hasIncome = day.transactions.some(t => t.type === TransactionType.income);
  const hasInvestment = day.transactions.some(t => t.type === TransactionType.investment);
  const hasfixedExpense = day.transactions.some(t => t.type === TransactionType.fixedExpense);
  const hasExpense = day.transactions.some(t => t.type === TransactionType.expense);
  const hasDailyCost = day.transactions.some(t => t.type === TransactionType.daily);

  if (hasIncome) {
    indicators.push(
      <div
        key="income"
        className="w-1.5 h-1.5 rounded-full bg-success shadow-sm ring-1 ring-white/80"
      />,
    );
  }
  if (hasInvestment) {
    indicators.push(
      <div
        key="invested"
        className="w-1.5 h-1.5 rounded-full bg-investment shadow-sm ring-1 ring-white/80"
      />,
    );
  }
  if (hasfixedExpense) {
    indicators.push(
      <div
        key="fixedExpense"
        className="w-1.5 h-1.5 rounded-full bg-expense shadow-sm ring-1 ring-white/80"
      />,
    );
  }
  if (hasExpense) {
    indicators.push(
      <div
        key="expense"
        className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-sm ring-1 ring-white/80"
      />,
    );
  }
  if (hasDailyCost) {
    indicators.push(
      <div
        key="daily"
        className="w-1.5 h-1.5 rounded-full bg-daily-expense shadow-sm ring-1 ring-white/80"
      />,
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5 mt-1">
      {indicators}
    </div>
  );
}
