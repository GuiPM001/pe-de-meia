import React from "react";
import DayBalanceFlag from "../dayBalanceFlag";
import TransactionsContainer from "../transactionsContainer";
import { decimalNumber } from "@/core/utils/numberFormat";
import Tooltip from "../ui/tooltip";
import { t } from "i18next";
import { CalendarProps } from ".";
import MonthSummary from "../monthSummary";
import { getWeekDays } from "@/core/utils/date";
import { useProfile } from "@/app/context/ProfileContext";
import { useCalendar } from "./useCalendar";

export default function CalendarDesktop(props: CalendarProps) {
  const { dayBalances, isToday } = useCalendar();
  const { profile } = useProfile();

  return (
    <div className="grid grid-cols-7 w-full">
      <MonthSummary dayBalances={dayBalances} loading={props.loading} />

      <div className="contents ">
        {getWeekDays("short").map((x, i) => (
          <div
            key={`${x}-${i}`}
            className="border-b border-gray-100 text-center font-bold text-xs text-gray-400 py-3 tracking-wider uppercase"
          >
            {x}
          </div>
        ))}
      </div>

      {dayBalances.map((x) => (
        <div
          className="border border-gray-100 h-32 relative -ml-[1px] -mt-[1px] hover:z-10 transition-all duration-200"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="bg-gray-50 h-full w-full"></div>
          ) : (
            <div
              className={`h-full group/day p-2 hover:bg-gray-50 flex flex-col ${
                isToday(x) ? "bg-gray-100" : ""
              }`}
            >
              <DayBalanceFlag
                dayBalance={x}
                totalInvested={x.totalInvested || 0}
                isToday={isToday(x)}
                loading={props.loading}
              />
              {!props.loading && (
                <>
                  <TransactionsContainer dayBalance={x} />

                  {x.hasEstimatedDailyExpense && (
                    <div className="group absolute bottom-[4px] right-[8px] z-0">
                      <span className="text-sm font-bold text-gray-300">
                        {decimalNumber(profile.dailyCost)}
                      </span>

                      <Tooltip
                        position="left"
                        label={t("tooltips.remaining")}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
