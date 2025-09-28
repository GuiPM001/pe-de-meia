import React from "react";
import { DayBalance } from "@/core/types/DayBalance";
import TransactionLabel from "./transactionLabel";
import { TransactionType } from "@/core/enums/transactionType";

interface TransactionsContainerProps {
  dayBalance: DayBalance;
}

export default function TransactionsContainer({
  dayBalance,
}: TransactionsContainerProps) {
  return (
    <div className="flex flex-col mx-2 lg:mx-4 gap-1 lg:gap-0.5">
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
