import React, { useEffect, useRef } from "react";
import IconButton from "@/components/ui/iconButton";
import { getMonthNameByDate } from "@/core/utils/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonth } from "@/app/context/MonthContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { useProfile } from "@/app/context/ProfileContext";

export default function MonthSelector() {
  const { months, monthSelected, selectMonth } = useMonth();
  const { getTransactions } = useTransaction();
  const { profile } = useProfile();

  const abortControllerRef = useRef<AbortController | null>(null);

  const [year, month] = monthSelected.id.split("-").map(Number);

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadTransactions = async (monthId: string) => {
      try {
        await getTransactions(monthId, profile._id, controller.signal);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        throw error;
      }
    };

    loadTransactions(monthSelected.id);

    return () => {
      controller.abort();
    };
  }, [monthSelected.id, profile._id]);

  const generateIdMonth = (year: number, month: number) => {
    return `${year}-${month.toString().padStart(2, "0")}-01`;
  };

  const shiftMonth = (d: number) => {
    abortControllerRef.current?.abort();

    const nextDate = new Date(year, month - 1 + d, 1);
    const idMonth = generateIdMonth(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1,
    );

    selectMonth(idMonth);
  };

  const hasPreviousMonth = (year: number, month: number) => {
    const nextDate = new Date(year, month - 1, 1);
    const idMonth = generateIdMonth(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1,
    );
    return months.some((m) => m.id === idMonth);
  };

  const hasNextMonth = (year: number, month: number) => {
    const nextDate = new Date(year, month, 1);
    const idMonth = generateIdMonth(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1,
    );
    return months.some((m) => m.id === idMonth);
  };

  const showPrev = hasPreviousMonth(year, month);
  const showNext = hasNextMonth(year, month);

  return (
    <div className="flex items-center justify-center relative">
      {showPrev && (
        <IconButton className="absolute left-14" onClick={() => shiftMonth(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </IconButton>
      )}

      <h2 className="font-display text-xl font-bold text-foreground capitalize">
        {getMonthNameByDate(monthSelected.id)}{" "}
        <span className="text-muted-foreground font-medium">
          {monthSelected.id.split("-")[0]}
        </span>
      </h2>

      {showNext && (
        <IconButton className="absolute right-14" onClick={() => shiftMonth(1)}>
          <ChevronRight className="w-5 h-5" />
        </IconButton>
      )}
    </div>
  );
}
