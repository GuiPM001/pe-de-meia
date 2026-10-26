import React from "react";
import { House } from "lucide-react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { TransactionType } from "@/core/enums/transactionType";
import { currencyNumber } from "@/core/utils/numberFormat";
import { Skeleton } from "@/components/ui/skeleton";
import { SummarySection } from "../summarySection";
import { useMonthSummary } from "../../hooks/useMonthSummary";
 
export function CostOfLivingCard() {
  const { monthSelected } = useMonth();
  const { profile } = useProfile();
  const { totalsByType, isLoading, getMonthDays } = useMonthSummary();

  const { futureDays } = getMonthDays(monthSelected?.id);
  const fixed = totalsByType[TransactionType.fixedExpense] ?? 0;
  const daily = totalsByType[TransactionType.daily] ?? 0;
  const costOfLiving = fixed + daily + (profile.dailyCost ?? 0) * futureDays;

  return (
    <SummarySection title="Custo de vida">
      <div className="bg-card border rounded-2xl p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            <House className="h-4 w-4 shrink-0 text-muted-foreground" />
            Total do mês
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fixas + diário realizado + previsto dos dias futuros
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-7 w-24 rounded-lg" />
        ) : (
          <p className="shrink-0 font-display text-lg font-bold tabular-nums">
            {currencyNumber(costOfLiving)}
          </p>
        )}
      </div>
    </SummarySection>
  );
}