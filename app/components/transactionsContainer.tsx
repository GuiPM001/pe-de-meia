import React from "react";
import { DayBalance } from "../types/DayBalance";
import TransactionLabel from "./transactionLabel";
import { TransactionType } from "../enums/transactionType";

interface TransactionsContainerProps {
  dayBalance: DayBalance;
}

export default function TransactionsContainer({
  dayBalance,
}: TransactionsContainerProps) {
  return (
    <div className="flex flex-col ml-4 gap-1">
      <TransactionLabel
        type={TransactionType.income}
        value={dayBalance.income}
      />
      <TransactionLabel
        type={TransactionType.expense}
        value={dayBalance.expense}
      />
      <TransactionLabel type={TransactionType.daily} value={dayBalance.daily} />
    </div>
  );
}
