import React from "react";
import { TransactionType } from "../enums/transactionType";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

interface TransactionLabelProps {
  value: number;
  type: TransactionType;
}

export default function TransactionLabel({
  value,
  type,
}: TransactionLabelProps) {
  if (value === 0) return <></>;

  const ICON_SIZE = "18px";

  const renderIcon = () => {
    if (type === TransactionType.income) {
      return <TbCaretUpFilled color="#00833b" size={ICON_SIZE} />;
    }
    if (type === TransactionType.expense) {
      return <TbCaretDownFilled color="#B8000F" size={ICON_SIZE} />;
    }

    return <TbCaretDownFilled color="#FFBB00" size={ICON_SIZE} />;
  };

  return (
    <span className="flex flex-row items-center justify-start text-xs">
      {renderIcon()}
      {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
    </span>
  );
}
