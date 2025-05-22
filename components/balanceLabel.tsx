import React from "react";

interface BalanceLabelProps {
  label: string;
  value: number;
  colorValue?: boolean;
}

export default function BalanceLabel({ label, value }: BalanceLabelProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <span>
      {label} <span className="font-bold">{formatNumber(value)}</span>
    </span>
  );
}
