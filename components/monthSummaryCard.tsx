import React from "react";
import { currencyNumber } from "@/core/utils/numberFormat";
import { IconType } from "react-icons/lib";
import { Skeleton } from "./ui/skeleton";

interface MonthSummaryCardProps {
  label: string;
  value: number;
  className: string;
  backgroundIcon: string;
  icon: IconType;
  loading: boolean;
}

export default function MonthSummaryCard(props: MonthSummaryCardProps) {
  if (props.loading) {
    return (
    <div className={`w-full rounded-lg px-3 lg:px-4 py-3 flex flex-row justify-between items-center shadow-sm bg-gray-50 border border-gray-300`}>
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{props.label}</span>
        <Skeleton className="h-5 w-20 rounded-lg mt-2" />
      </div>

      <props.icon className={`text-white p-1.5 rounded-lg h-8 w-8 bg-gray-400`} />
    </div>
    )
  }

  return (
    <div className={`w-full rounded-lg px-3 lg:px-4 py-3 flex flex-row justify-between items-center shadow-sm bg-gray-50 border border-gray-300 ${props.className}`}>
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{props.label}</span>
        <span className="text-lg font-semibold">
          {currencyNumber(props.value)}
        </span>
      </div>

      <props.icon className={`p-1.5 rounded-lg h-8 w-8 text-white ${props.backgroundIcon}`} />
    </div>
  );
}
