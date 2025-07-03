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
  const hoverBgMap: Record<TransactionType, string> = {
    [TransactionType.income]: "hover:bg-green-hover",
    [TransactionType.expense]: "hover:bg-red-hover",
    [TransactionType.daily]: "hover:bg-yellow-hover",
    [TransactionType.investment]: "hover:bg-blue-hover",
  };

  const renderIcon = () => {
    if (type === TransactionType.income)
      return <TbCaretUpFilled className="text-green-text" size={ICON_SIZE} />;

    if (type === TransactionType.investment)
      return <div className="h-1 w-3 m-[3px] rounded-xl bg-blue-default"></div>;

    if (type === TransactionType.expense)
      return <TbCaretDownFilled className="text-red-text" size={ICON_SIZE} />;

    return <TbCaretDownFilled className="text-yellow-text" size={ICON_SIZE} />;
  };

  const handleModals = (name: "delete" | "edit", open: boolean) => {
    setOpenModals({ ...openModals, [name]: open });
  };

  return (
    <>
      <div
        className={`relative group flex flex-row items-center justify-between text-xs ${hoverBgMap[type]} py-0.5 rounded-md z-10`}
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
