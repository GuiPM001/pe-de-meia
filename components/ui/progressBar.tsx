import { currencyNumber } from "@/core/utils/numberFormat";
import React from "react";
import LoadingSpinner from "./loadingSpinner";

interface ProgressBarProps {
  value: number;
  minLabel: string;
  max: number;
  maxLabel: string;
  loading: boolean;
}

export default function ProgressBar({
  value,
  minLabel,
  max,
  maxLabel,
  loading,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1">
          <span className="text-green-text font-semibold text-sm">
            {minLabel}
          </span>
          <span className="text-green-text font-semibold text-sm">
            {loading ? <LoadingSpinner /> : currencyNumber(value)}
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <span className="text-gray-500 text-sm">{maxLabel} </span>
          <span className="text-gray-500 text-sm">{currencyNumber(max)}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-md h-[6px] mt-0.5 mb-4">
        <div
          className="bg-green-text h-[6px] transition-all duration-500 ease-in-out rounded-md"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
