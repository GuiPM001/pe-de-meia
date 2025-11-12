import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";
import { currencyNumber } from "@/core/utils/numberFormat";
import React from "react";

interface SummaryTransactionsProps {
  title: string;
  type: TransactionType;
  transactions: Transaction[];
}
export default function SummaryTransactions({
  title,
  type,
  transactions,
}: SummaryTransactionsProps) {
  const total = transactions?.reduce((acc, t) => t.value + acc, 0) ?? 0;

  let textColor = "text-yellow-text";
  if (type === TransactionType.income) textColor = "text-green-text";
  if (type === TransactionType.expense) textColor = "text-red-text";
  if (type === TransactionType.investment) textColor = "text-blue-text";

  return (
    <div className="flex flex-col">
      <span className={`font-semibold text-lg mb-2 ${textColor}`}>{title}</span>

      {transactions.map((t) => (
        <div key={t._id} className="flex flex-row justify-between">
          <span>{t.description}</span>
          <span>{currencyNumber(t.value)}</span>
        </div>
      ))}

      <div className="flex flex-row justify-between font-semibold mt-2">
        <span>Total</span>
        <span>{currencyNumber(total)}</span>
      </div>
    </div>
  );
}
