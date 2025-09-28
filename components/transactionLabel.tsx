import React, { useState } from "react";
import { TransactionType } from "@/core/enums/transactionType";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { TbTrash, TbPencil } from "react-icons/tb";
import { Transaction } from "@/core/types/Transaction";
import DeleteTransactionModal from "./modals/deleteTransactionModal";
import IconButton from "./ui/iconButton";
import EditTransactionModal from "./modals/selectTransactionModal";
import { sumValues } from "@/core/utils/sumValues";
import Tooltip from "./ui/tooltip";

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
  const textColorMap: Record<TransactionType, string> = {
    [TransactionType.income]: "text-green-text",
    [TransactionType.expense]: "text-red-text",
    [TransactionType.daily]: "text-yellow-text",
    [TransactionType.investment]: "bg-blue-default",
  };
  const bgColorMap: Record<TransactionType, string> = {
    [TransactionType.income]: "bg-green-hover",
    [TransactionType.expense]: "bg-red-hover",
    [TransactionType.daily]: "bg-yellow-hover",
    [TransactionType.investment]: "bg-blue-hover",
  };

  const renderIcon = () => {
    if (type === TransactionType.income)
      return <TbCaretUpFilled className={textColorMap[type]} size={ICON_SIZE} />;

    if (type === TransactionType.investment)
      return <div className={`h-1 w-3 m-[3px] rounded-xl ${textColorMap[type]}`}></div>;

    return <TbCaretDownFilled className={textColorMap[type]} size={ICON_SIZE} />;
  };

  const handleModals = (name: "delete" | "edit", open: boolean) => {
    setOpenModals({ ...openModals, [name]: open });
  };

  return (
    <>
      <div className={`block lg:hidden w-full h-2.5 rounded-lg ${bgColorMap[type]}`}></div>

      <div
        className={`relative group lg:flex hidden flex-row items-center justify-between text-xs hover:${bgColorMap[type]} py-0.5 rounded-md z-10`}
      >
        <div className="flex flex-row items-center">
          {renderIcon()}

          {sumValues(transactions).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </div>

        <div className="flex flex-row gap-1">
          <IconButton
            className="opacity-0 group-hover:opacity-100 text-gray-700"
            onClick={() => handleModals("edit", true)}
          >
            <TbPencil size={ICON_SIZE} />
          </IconButton>

          <IconButton
            className="opacity-0 group-hover:opacity-100 text-gray-700"
            onClick={() => handleModals("delete", true)}
          >
            <TbTrash size={ICON_SIZE} />
          </IconButton>
        </div>

        <Tooltip
          position="left"
          label={transactions.map((t) => t.description).join("\n")}
        />
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
