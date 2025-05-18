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
    <div className="flex flex-col mx-4 gap-0.5">
      <TransactionLabel
        type={TransactionType.income}
        transaction={dayBalance.income}
        idMonth={dayBalance.idMonth}
      />
      <TransactionLabel
        type={TransactionType.expense}
        transaction={dayBalance.expense}
        idMonth={dayBalance.idMonth}
      />
      <TransactionLabel
        type={TransactionType.daily}
        transaction={dayBalance.daily}
        idMonth={dayBalance.idMonth}
      />
    </div>
  );
}
