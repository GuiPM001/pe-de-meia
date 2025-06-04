import React, { useState } from "react";
import { TransactionType } from "@/core/enums/transactionType";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { TbTrash, TbPencil } from "react-icons/tb";
import { Transaction } from "@/core/types/Transaction";
import DeleteTransactionModal from "./modals/deleteTransactionModal";
import IconButton from "./ui/iconButton";
import EditTransactionModal from "./modals/selectTransactionModal";
import { sumValues } from "@/core/utils/sumValues";

interface TransactionLabelProps {
  transactions: Transaction[] | null;
  type: TransactionType;
  idMonth: string;
}

export default function TransactionLabel({
  transactions,
  type,
}: TransactionLabelProps) {
  const [openModals, setOpenModals] = useState({
    delete: false,
    edit: false,
  });

  if (!transactions || !transactions.length) return <></>;

  const ICON_SIZE = "18px";

  const colorMap: Record<TransactionType, string> = {
    [TransactionType.income]: "green",
    [TransactionType.expense]: "red",
    [TransactionType.daily]: "yellow",
    [TransactionType.investment]: "blue",
  };

  const COLOR = colorMap[type];

  const renderIcon = () => {
    if (type === TransactionType.income)
      return (
        <TbCaretUpFilled className={`text-${COLOR}-text`} size={ICON_SIZE} />
      );

    if (type === TransactionType.investment)
      return (
        <div className={`h-1 w-3 m-[3px] rounded-xl bg-${COLOR}-default`}></div>
      );

    return (
      <TbCaretDownFilled className={`text-${COLOR}-text`} size={ICON_SIZE} />
    );
  };

  const handleModals = (name: "delete" | "edit", open: boolean) => {
    setOpenModals({ ...openModals, [name]: open });
  };

  return (
    <>
      <div
        className={`relative group/transaction flex flex-row items-center justify-between text-xs hover:bg-${COLOR}-hover py-0.5 rounded-md`}
      >
        <div className="flex flex-row items-center">
          {renderIcon()}

          {sumValues(transactions).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </div>

        <div className="flex flex-row gap-1">
          <IconButton
            className="opacity-0 group-hover/transaction:opacity-100 text-gray-600"
            onClick={() => handleModals("edit", true)}
          >
            <TbPencil size={ICON_SIZE} />
          </IconButton>

          <IconButton
            className="opacity-0 group-hover/transaction:opacity-100 text-gray-600"
            onClick={() => handleModals("delete", true)}
          >
            <TbTrash size={ICON_SIZE} />
          </IconButton>
        </div>

        <div className="absolute whitespace-nowrap right-full top-1/2 z-20 mr-3 -translate-y-1/2 rounded bg-black py-2 px-4 text-sm text-white hidden group-hover/transaction:block">
          <span className="absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 bg-black"></span>
          {transactions.map((t) => (
            <p key={t._id} className="text-right">
              {t.description}
            </p>
          ))}
        </div>
      </div>

      <DeleteTransactionModal
        open={openModals.delete}
        onClose={() => handleModals("delete", false)}
        transactionsToDelete={transactions}
      />

      <EditTransactionModal
        open={openModals.edit}
        onClose={() => handleModals("edit", false)}
        transactions={transactions}
      />
    </>
  );
}
