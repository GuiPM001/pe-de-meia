import React from "react";
import { DayBalance } from "@/core/types/DayBalance";
import TransactionLabel from "./transactionLabel";
import { TransactionType } from "@/core/enums/transactionType";
import { Skeleton } from "./ui/skeleton";

interface TransactionsContainerProps {
  dayBalance: DayBalance;
  loading: boolean
}

export default function TransactionsContainer({
  dayBalance,
  loading
}: TransactionsContainerProps) {
  if (loading) {
    return (
      <Skeleton className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-lg" />
    )
  }

  return (
    <div className="flex flex-row gap-0.5 lg:gap-1">
      <TransactionLabel
        type={TransactionType.income}
        transactions={dayBalance.incomes}
        idMonth={dayBalance.idMonth}
      />

      <TransactionLabel
        type={TransactionType.expense}
        transactions={dayBalance.expenses}
        idMonth={dayBalance.idMonth}
      />

      <TransactionLabel
        type={TransactionType.daily}
        transactions={dayBalance.dailies}
        idMonth={dayBalance.idMonth}
      />

      <TransactionLabel
        type={TransactionType.investment}
        transactions={dayBalance.investeds}
        idMonth={dayBalance.idMonth}
      />
    </div>
  );
}
