import React, { useEffect, useState } from "react";
import MonthSummary from "../monthSummary";
import DayBalanceFlag from "../dayBalanceFlag";
import TransactionsContainer from "../transactionsContainer";
import { CalendarComponentProps } from ".";
import { getWeekDays } from "@/core/utils/date";
import { DayBalance } from "@/core/types/DayBalance";
import DailyTransactionModal from "../modals/dailyTransactionsModal";

export default function CalendarMobile(props: CalendarComponentProps) {
  const { dayBalances, indexMonth, loading } = props;

  const [dailyModal, setDailyModal] = useState<DayBalance | null>(null);

  const today = new Date();

  useEffect(() => {
    setDailyModal(prev => {
      if (prev === null) return prev;
      
      return dayBalances.find(x => x.day === prev.day && x.total !== null) ?? null;
    });
  }, [dayBalances]);

  return (
    <div className="grid grid-cols-7 w-full mb-10">
      <MonthSummary dayBalances={dayBalances} />

      <div className="contents">
        {getWeekDays("narrow").map((x, i) => (
          <div
            key={`${x}-${i}`}
            className="border-b border-gray-200 text-center font-black py-1 self-end mt-4 uppercase"
          >
            {x}
          </div>
        ))}
      </div>

      {dayBalances.map((x: DayBalance) => (
        <div
          className="border-b border-gray-200 h-30 relative"
          key={`${x.day}-${x.total}`}
        >
          {x.total === null ? (
            <div className="flex flex-col justify-between items-center m-3 text-gray-300 font-semibold">
              {x.day}
            </div>
          ) : (
            <button
              onClick={() => setDailyModal(x)}
              className={`group/day h-full w-full flex flex-col cursor-pointer ${
                x.day === today.getDate() && today.getMonth() === indexMonth
                  ? "rounded-md"
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
            </button>
          )}
        </div>
      ))}

      {dailyModal && (
        <DailyTransactionModal
          dayBalance={dailyModal}
          onClose={() => setDailyModal(null)}
          open={!!dailyModal}
        />
      )}
    </div>
  );
}
