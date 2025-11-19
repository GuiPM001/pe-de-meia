import React from "react";
import { TransactionType } from "@/core/enums/transactionType";
import { Transaction } from "@/core/types/Transaction";
import { currencyNumber, decimalNumber } from "@/core/utils/numberFormat";
import { TbPencil, TbTrash } from "react-icons/tb";
import IconButton from "./ui/iconButton";

interface SummaryTransactionsProps {
  title: string;
  type: TransactionType;
  transactions: Transaction[];
  transactionClicked: Transaction | null;
  onClickTransaction: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
}
export default function SummaryTransactions({
  title,
  type,
  transactions,
  transactionClicked,
  onClickTransaction,
  onDelete,
  onEdit,
}: SummaryTransactionsProps) {
  const ICON_SIZE = "20px";

  const total = transactions?.reduce((acc, t) => t.value ?? 0 + acc, 0) ?? 0;

  let textColor = "text-yellow-text";
  if (type === TransactionType.income) textColor = "text-green-text";
  if (type === TransactionType.expense) textColor = "text-red-text";
  if (type === TransactionType.investment) textColor = "text-blue-text";

  return (
    <div className="flex flex-col">
      <span className={`font-semibold mb-2 ${textColor}`}>{title} <span className="text-sm front-medium text-gray-400">({currencyNumber(total)})</span></span>

      {transactions.map((t) => (
        <button
          key={t._id}
          className="grid grid-cols-5"
          onClick={() => onClickTransaction(t)}
        >
          <span className="col-span-3 justify-self-start overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">{t.description}</span>

          <div className="col-span-2 flex flex-row items-center justify-end">
            <span className="transition-all duration-300 ease-out">
              {decimalNumber(t.value ?? 0)}
            </span>

            <div className={
              `overflow-hidden transition-all duration-300 ease-out flex flex-row gap-2
              ${transactionClicked === t ? "w-12 opacity-100 ml-2" : "w-0 opacity-0"}`}
            >
              <IconButton className="text-gray-700" onClick={() => onEdit(t)}>
                <TbPencil size={ICON_SIZE} />
              </IconButton>

              <IconButton className="text-gray-700" onClick={() => onDelete(t)}>
                <TbTrash size={ICON_SIZE} />
              </IconButton>
            </div>
          </div>
        </button>
      ))}

      <div className="h-px w-full my-4 bg-gray-200 rounded-full"></div>
    </div>
  );
}
