import React, { useState } from "react";
import { TransactionType } from "@/core/enums/transactionType";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { TransactionDay } from "@/core/types/DayBalance";
import { TbTrash } from "react-icons/tb";
import IconButton from "./ui/iconButton";
import DeleteTransactionModal from "./modals/deleteTransactionModal";

interface TransactionLabelProps {
  transaction: TransactionDay | null;
  type: TransactionType;
  idMonth: string;
}

export default function TransactionLabel({
  transaction,
  type,
  idMonth
}: TransactionLabelProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  if (!transaction || !transaction.value) return <></>;

  const ICON_SIZE = "18px";
  let COLOR = "yellow";
  if (type === TransactionType.income) COLOR = "green";
  if (type === TransactionType.expense) COLOR = "red";

  const renderIcon = () => {
    if (type === TransactionType.income) {
      return <TbCaretUpFilled className={`text-${COLOR}-text`} size={ICON_SIZE} />;
    }

    if (type === TransactionType.expense) {
      return <TbCaretDownFilled className={`text-${COLOR}-text`} size={ICON_SIZE} />;
    }

    return <TbCaretDownFilled className={`text-${COLOR}-text`} size={ICON_SIZE} />;
  };

  return (
    <>
      <button
        className={`relative group flex flex-row items-center justify-between text-xs hover:bg-${COLOR}-hover py-0.5 rounded-md`}
      >
        <div className="flex flex-row items-center">
          {renderIcon()}

          {transaction.value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </div>

        <IconButton
          className="opacity-0 group-hover:opacity-100 text-gray-600"
          onClick={() => setModalOpen(true)}
        >
          <TbTrash size={ICON_SIZE} />
        </IconButton>

        <div className="absolute whitespace-nowrap right-full top-1/2 z-20 mr-3 -translate-y-1/2 rounded bg-black py-2 px-4 text-sm text-white opacity-0 group-hover:opacity-100">
          <span className="absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 bg-black"></span>
          {transaction.description.split(" - ").map((line, index) => (
            <p key={`${index}${line}`} className="text-right">
              {line}
            </p>
          ))}
        </div>
      </button>
      
      {modalOpen && (
        <DeleteTransactionModal
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          transaction={transaction}
          idMonth={idMonth}
        />
      )}
    </>
  );
}
