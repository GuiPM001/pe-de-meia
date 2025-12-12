import React from "react";
import DayBalanceFlag from "../dayBalanceFlag";
import TransactionsContainer from "../transactionsContainer";
import { currencyNumber } from "@/core/utils/numberFormat";
import Tooltip from "../ui/tooltip";
import { t } from "i18next";
import { CalendarProps } from ".";
import MonthSummary from "../monthSummary";
import { getWeekDays } from "@/core/utils/date";
import { useProfile } from "@/app/context/ProfileContext";
import { useCalendar } from "./useCalendar";

export default function CalendarDesktop(props: CalendarProps) {
  const { dayBalances, isToday } = useCalendar(props);
  const { profile } = useProfile();

  return (
    <div className="grid grid-cols-7 w-full">
      <MonthSummary dayBalances={dayBalances} />

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

      {dayBalances.map((x) => (
        <div
          className="border border-gray-200 h-30 relative"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="bg-gray-100 h-full w-full"></div>
          ) : (
            <div
              className={`h-full group/day ${
                isToday(x) ? "border-3 border-gray-600 rounded-md" : ""
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
                        {currencyNumber(profile.dailyCost)}
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
