import { getColors } from "@/core/utils/getColors";
import React, { useEffect, useState } from "react";
import TransactionsContainer from "../transactionsContainer";
import { DayBalance } from "@/core/types/DayBalance";
import { useProfile } from "@/app/context/ProfileContext";
import DailyTransactionModal from "../modals/dailyTransactionsModal";

interface DaysGridProps {
  dayBalances: DayBalance[];
  isToday: (dayBalance: DayBalance) => boolean;
  isLoading: boolean;
}

export default function DaysGrid({
  dayBalances,
  isToday,
  isLoading,
}: DaysGridProps) {
  const { profile } = useProfile();

  const [dailyModal, setDailyModal] = useState<DayBalance | null>(null);

  useEffect(() => {
    setDailyModal((prev) => {
      if (prev === null) return prev;

      return (dayBalances.find((x) => x.day === prev.day && x.total !== null) ?? null);
    });
  }, [dayBalances]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayBalances.map((dayData, index) => (
        <button
          key={index}
          onClick={() => setDailyModal(dayData)}
          className={`
              relative flex flex-col items-center justify-start pt-2 pb-3 gap-1 rounded-xl min-h-[54px] cursor-pointer
              ${getColors(
                dayData.total,
                dayData.totalInvested ?? 0,
                profile.savingTarget,
                isToday(dayData) && !isLoading,
              )}
            `}
        >
          <span
            className={`
                text-sm
                ${isToday(dayData) ? "font-semibold" : ""}
                ${getColors(
                  dayData.total,
                  dayData.totalInvested!,
                  profile.savingTarget,
                  false,
                  false,
                )}
              `}
          >
            {dayData.day}
          </span>

          <TransactionsContainer dayBalance={dayData} loading={isLoading} />
        </button>
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
