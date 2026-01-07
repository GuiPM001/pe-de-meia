import React from "react";
import { Month } from "@/core/types/Month";
import { getMonthNameByDate } from "@/core/utils/date";
import { getColors } from "@/core/utils/getColors";
import { TbCirclePlusFilled } from "react-icons/tb";
import LoadingSpinner from "./ui/loadingSpinner";

interface MonthButtonProps {
  month: Month;
  selected: boolean;
  savingTarget: number;
  addMonth: (idMonth: string) => void;
  monthLoading: string;
  setMonth: (month: Month) => void;
}

export default function MonthButton({
  month,
  savingTarget,
  selected,
  addMonth,
  monthLoading,
  setMonth,
}: MonthButtonProps) {
  const now = new Date();
  const dateMonth = new Date(month.id);

  return (
    <>
      {dateMonth > now && month.balance === null ? (
        <button
          onClick={() => addMonth(month.id)}
          disabled={monthLoading === month.id}
          className={`group capitalize w-full min-w-24 h-[40px] px-4 mb-3 rounded-xl flex justify-center 
                      items-center cursor-pointer font-semibold bg-gray-100 text-gray-400
                      hover:bg-gray-200 transition-all duration-200
                      disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300`}
        >
          {monthLoading === month.id ? (
            <div className="scale-75">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <span className="hidden group-hover:block text-sm">
                {getMonthNameByDate(month.id)}
              </span>
              <TbCirclePlusFilled
                size="20px"
                className="block group-hover:hidden text-gray-400"
              />
            </>
          )}
        </button>
      ) : (
        <button
          onClick={() => setMonth(month)}
          disabled={month.balance === null && dateMonth < now}
          className={`capitalize w-full min-w-24 h-[40px] px-4 mb-3 rounded-xl flex justify-center items-center cursor-pointer
                    transition-all duration-200 text-sm
                    disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400
                      ${selected ? "font-bold shadow-sm scale-105" : "font-medium hover:bg-gray-100"}
                      ${getColors(
                        month.balance!,
                        month.invested!,
                        savingTarget,
                        selected
                      )}`}
        >
          <span>{getMonthNameByDate(month.id)}</span>
        </button>
      )}
    </>
  );
}
