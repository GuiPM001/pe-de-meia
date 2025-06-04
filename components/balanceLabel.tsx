import { currencyNumber } from "@/core/utils/numberFormat";
import React from "react";

interface BalanceLabelProps {
  label: string;
  value: number;
  colorValue?: boolean;
}

export default function BalanceLabel({ label, value }: BalanceLabelProps) {
  return (
    <span>
      {label} <span className="font-bold">{currencyNumber(value)}</span>
    </span>
  );
}
