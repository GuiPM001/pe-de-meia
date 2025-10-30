import React from "react";
import DayBalanceFlag from "../dayBalanceFlag";
import TransactionsContainer from "../transactionsContainer";
import { currencyNumber } from "@/core/utils/numberFormat";
import Tooltip from "../ui/tooltip";
import { t } from "i18next";
import { CalendarComponentProps } from ".";
import MonthSummary from "../monthSummary";
import { getWeekDays } from "@/core/utils/date";

export default function CalendarDesktop(props: CalendarComponentProps) {
  const { monthlySummary, indexMonth, loading } = props;

  const today = new Date();

  return (
    <div className="grid grid-cols-7 w-full">
      <MonthSummary monthlySummary={monthlySummary} />

      <div className="contents ">
        {getWeekDays("short").map((x, i) => (
          <div
            key={`${x}-${i}`}
            className="border border-t-0 border-gray-200 text-center font-black py-1 self-end mt-4 uppercase"
          >
            {x}
          </div>
        ))}
      </div>

      {monthlySummary.dayBalances.map((x) => (
        <div
          className="border border-gray-200 h-30 relative"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="bg-gray-100 h-full w-full"></div>
          ) : (
            <div
              className={`h-full group/day ${
                x.day === today.getDate() && today.getMonth() === indexMonth
                  ? "border-3 border-gray-600 rounded-md"
                  : ""
              }`}
            >
              <DayBalanceFlag
                loading={loading}
                dayBalance={x}
                totalInvested={x.totalInvested || 0}
                isToday={
                  x.day === today.getDate() && today.getMonth() === indexMonth
                }
              />

              <TransactionsContainer dayBalance={x} />

              {new Date(today.getFullYear(), indexMonth, x.day, 23, 59, 59) >=
                today && (
                <div className="group absolute bottom-[4px] right-[8px] z-0">
                  <span className="text-sm font-bold text-gray-300">
                    {currencyNumber(monthlySummary.remainingDailyExpenses)}
                  </span>

                  <Tooltip position="left" label={t("tooltips.remaining")} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
