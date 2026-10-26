import React from "react";
import { Gauge } from "lucide-react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { TransactionType } from "@/core/enums/transactionType";
import { cn } from "@/lib/utils";
import { currencyNumber } from "@/core/utils/numberFormat";
import { Skeleton } from "@/components/ui/skeleton";
import { SummarySection } from "../summarySection";
import { useMonthSummary } from "../../hooks/useMonthSummary";

function getElapsedLabel(days: number, isCurrentMonth: boolean) {
  const unit = days === 1 ? "dia" : "dias";
  if (!isCurrentMonth) return `${days} ${unit} do mês`;
  return `${days} ${unit} ${days === 1 ? "decorrido" : "decorridos"}`;
}

function getDeltaLabel(delta: number) {
  if (delta > 0) return `${currencyNumber(delta)} acima`;
  if (delta < 0) return `${currencyNumber(-delta)} abaixo`;
  return "igual";
}

export function DailyPlanningCard() {
  const { monthSelected } = useMonth();
  const { profile } = useProfile();
  const { totalsByType, isLoading, getMonthDays } = useMonthSummary();

  const { realizedDays, isCurrentMonth } = getMonthDays(monthSelected?.id);
  const totalDaily = totalsByType[TransactionType.daily] ?? 0;
  const dailyCost = profile?.dailyCost ?? 0;
  const dailyAverage = realizedDays > 0 ? totalDaily / realizedDays : 0;
  const delta = dailyAverage - dailyCost;
  const deltaColor = delta > 0 ? "text-expense" : "text-success";

  return (
    <SummarySection title="Planejamento diário">
      <div className="bg-card border rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              Diário médio gasto
            </p>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-8 w-28 rounded-lg" />
            ) : (
              <p className={cn("mt-1 font-display text-2xl font-bold tabular-nums", deltaColor)}>
                {currencyNumber(dailyAverage)}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-md border border-gray-500/25 bg-gray-500/15 px-2 py-1 text-[11px] font-semibold text-gray-500">
            Cadastrado {currencyNumber(dailyCost)}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {getElapsedLabel(realizedDays, isCurrentMonth)} ·{" "}
          {isLoading ? (
            "calculando..."
          ) : (
            <span className={cn("font-semibold", deltaColor)}>
              {getDeltaLabel(delta)} do valor cadastrado
            </span>
          )}
        </p>
      </div>
    </SummarySection>
  );
}