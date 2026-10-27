import React from "react";
import { useTranslation } from "react-i18next";
import { getTransactionProps } from "@/core/constants/transactionProps";
import { cn } from "@/lib/utils";
import { currencyNumber } from "@/core/utils/numberFormat";
import { Skeleton } from "@/components/ui/skeleton";
import { SummarySection } from "./summarySection";
import { useMonthSummary } from "../hooks/useMonthSummary";

export function TransactionTotals() {
  const { t } = useTranslation();
  const { totalsByType, isLoading } = useMonthSummary();

  const rows = Object.entries(getTransactionProps(t));

  return (
    <SummarySection
      title={t("monthSummary.transactionTotals")}
      className="space-y-2"
    >
      <div className="bg-card border rounded-2xl divide-y">
        {rows.map(([type, { label, icon: Icon, cls }]) => (
          <div
            key={type}
            className="flex items-center justify-between gap-3 p-3.5 first:rounded-t-2xl last:rounded-b-2xl"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                  cls,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-20 rounded-md" />
            ) : (
              <span className="text-sm font-semibold tabular-nums">
                {currencyNumber(totalsByType[Number(type)] ?? 0)}
              </span>
            )}
          </div>
        ))}
      </div>
    </SummarySection>
  );
}