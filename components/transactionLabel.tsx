import React from "react";
import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";

interface TransactionLabelProps {
  transactions: Transaction[] | null;
  type: TransactionType;
  idMonth: string;
}

export default function TransactionLabel({
  transactions,
  type,
}: TransactionLabelProps) {
  if (!transactions || !transactions.length) return <></>;

  const bgColorMap: Record<TransactionType, string> = {
    [TransactionType.income]: "bg-green-text",
    [TransactionType.expense]: "bg-red-text",
    [TransactionType.daily]: "bg-yellow-text",
    [TransactionType.investment]: "bg-blue-text",
  };

  return (
    <div className={`w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-lg ${bgColorMap[type]}`}></div>
  );
}
