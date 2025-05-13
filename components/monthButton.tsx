import React from "react";
import { Month } from "@/core/types/Month";
import { getMonthNameByDate } from "@/core/utils/date";
import { getColors } from "@/core/utils/getColors";
import { TbCirclePlusFilled, TbCirclesFilled } from "react-icons/tb";

interface MonthButtonProps {
  month: Month;
  selected: boolean;
  savingTarget: number;
  setMonthSelected: (indexMonth: number) => void;
  addMonth: (idMonth: string) => void;
  monthLoading: string;
  setMonth: (month: Month) => void;
}

export default function MonthButton({
  month,
  savingTarget,
  selected,
  setMonthSelected,
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
          className={`group capitalize w-24 h-[32px] py-1 px-2 mb-2 rounded-md flex justify-center 
                      items-center cursor-pointer font-semibold bg-gray-300 text-gray-700
                      disabled:bg-gray-200 disabled:cursor-default disabled:text-gray-400`}
        >
          {monthLoading === month.id ? (
            <TbCirclesFilled size="20px" className="animate-spin" />
          ) : (
            <>
              <span className="hidden group-hover:block">
                {getMonthNameByDate(month.id)}
              </span>
              <TbCirclePlusFilled
                size="20px"
                className="block group-hover:hidden"
              />
            </>
          )}
        </button>
      ) : (
        <button
          onClick={() => {
            setMonthSelected(dateMonth.getMonth());
            setMonth(month);
          }}
          disabled={month.balance === null && dateMonth < now}
          className={`capitalize w-24 h-[32px] py-1 px-2 mb-2 rounded-md flex justify-center cursor-pointer
                    disabled:bg-gray-200 disabled:cursor-default disabled:text-gray-400
                      ${selected ? "font-bold" : "font-semibold"}
                      ${getColors(month.balance || 0, savingTarget, selected)}`}
        >
          <span>{getMonthNameByDate(month.id)}</span>
        </button>
      )}
    </>
  );
}
