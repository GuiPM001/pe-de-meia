import React, { useEffect } from "react";
import IconButton from "@/components/ui/iconButton";
import { getMonthNameByDate } from "@/core/utils/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonth } from "@/app/context/MonthContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { useProfile } from "@/app/context/ProfileContext";
import "@/core/utils/date.extensions";

export default function MonthSelector() {
  const { months, monthSelected, selectMonth, hasNextMonth, hasPreviousMonth } = useMonth();
  const { transactions, getTransactions } = useTransaction();
  const { profile } = useProfile();

  const [year, month] = monthSelected.id.split("-").map(Number);

  useEffect(() => {
    if (!months.length || !monthSelected?.id || !profile?._id) return;

    if (transactions === null || transactions[0]?.idMonth !== monthSelected.id) {
      getTransactions(monthSelected.id, profile._id);
    }
  }, [monthSelected, profile._id, months]);

  useEffect(() => {
    const idMonth = new Date(
      new Date().getFullYear(),
      new Date().getUTCMonth(),
      1,
    ).toISODateString();

    selectMonth(idMonth);
  }, []);

  const shiftMonth = (d: number) => {
    const nextDate = new Date(year, month - 1 + d, 1);
    const idMonth = nextDate.toISODateString();

    selectMonth(idMonth);
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
