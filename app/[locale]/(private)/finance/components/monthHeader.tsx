import React from "react";
import { useTranslation } from "react-i18next";
import { useMonth } from "@/app/context/MonthContext";
import { Month } from "@/core/types/Month";
import { cn } from "@/lib/utils";
import { currencyNumber } from "@/core/utils/numberFormat";
import { getMonthNameByDate } from "@/core/utils/date";
import { getMonthStatusStyles, GoalStatus } from "@/core/utils/goalStyle";
import { getStatuses, MonthAvailability } from "../finance.types";

interface MonthHeaderProps {
  getGoalStatus: (
    month: Month | undefined,
    availability: MonthAvailability,
  ) => GoalStatus;
}

export function MonthHeader({ getGoalStatus }: MonthHeaderProps) {
  const { t } = useTranslation();
  const statuses = getStatuses(t);
  const { monthSelected } = useMonth();

  const goalStatus = getGoalStatus(monthSelected, "registered");
  const status = statuses[goalStatus];
  const balance = monthSelected?.balance ?? 0;
  const monthId = monthSelected?.id;
  const year = monthId?.split("-")[0];

  return (
    <section aria-label="Resumo do mês" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold capitalize">
          {monthId ? getMonthNameByDate(monthId) : "—"} {year}
        </h2>
        {status && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold",
              getMonthStatusStyles(goalStatus, false),
            )}
          >
            {status.label}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Saldo do mês</p>
      <p
        className={cn(
          "mt-1 mb-1 font-display text-3xl font-bold tabular-nums",
          balance < 0 ? "text-expense" : "text-foreground",
        )}
      >
        {currencyNumber(balance)}
      </p>
    </section>
  );
}