import { currencyNumber } from "@/core/utils/numberFormat";
import React from "react";

interface BalanceLabelProps {
  label: string;
  value: number;
  colorValue?: string;
}

export default function BalanceLabel({
  label,
  value,
  colorValue,
}: BalanceLabelProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <span className="text-gray-400 lg:mr-2">{label}</span>
      <span className={`${colorValue} font-bold`}>{currencyNumber(value)}</span>
    </div>
  );
}
