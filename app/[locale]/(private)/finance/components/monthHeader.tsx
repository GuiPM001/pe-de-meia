import React from "react";
import { useTranslation } from "react-i18next";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { cn } from "@/lib/utils";
import { currencyNumber } from "@/core/utils/numberFormat";
import { getMonthNameByDate } from "@/core/utils/date";
import {
  getGoalStatus,
  getStatusStyles,
} from "@/core/utils/goalStyle";
import { getStatuses } from "../finance.types";
import { useMonthSummary } from "../hooks/useMonthSummary";

export function MonthHeader() {
  const { t } = useTranslation();
  const statuses = getStatuses(t);
  const { monthSelected } = useMonth();
  const { profile } = useProfile();
  const { hasDailyTransactionToday } = useMonthSummary();

  const goalStatus = getGoalStatus(
    monthSelected.id!,
    monthSelected.balance,
    profile.savingTarget,
    monthSelected.invested ?? 0,
  );
  const status = statuses[goalStatus];
  const monthId = monthSelected.id;
  const year = monthId?.split("-")[0];

  const balance = hasDailyTransactionToday 
    ? monthSelected.balance! + profile.dailyCost 
    : monthSelected.balance!;
  
  const statusStyle = getStatusStyles(goalStatus, false);

  return (
    <section aria-label="Resumo do mês" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold capitalize">
          {monthId ? getMonthNameByDate(monthId) : "—"} {year}
        </h2>
        {status && (
          <span
            className={cn(
              statusStyle,
              "flex items-center gap-1 rounded-md px-3 py-1 text-[11px] font-semibold",
            )}
          >
            {status.label}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{t("monthSummary.balance")}</p>
      <p
        className={cn(
          statusStyle,
          "mt-1 mb-1 font-display text-3xl font-bold tabular-nums bg-transparent",
        )}
      >
        {currencyNumber(balance)}
      </p>
    </section>
  );
}
