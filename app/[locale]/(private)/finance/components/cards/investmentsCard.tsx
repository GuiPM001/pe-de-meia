import React from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { currencyNumber } from "@/core/utils/numberFormat";
import { SummarySection } from "../summarySection";
import ProgressBar from "@/components/ui/progressBar";

const T = "monthSummary.investments";

export function InvestmentsCard() {
  const { t } = useTranslation();
  const { monthSelected } = useMonth();
  const { profile } = useProfile();

  const invested = monthSelected?.invested ?? 0;
  const savingTarget = profile?.savingTarget ?? 0;
  const progress =
    savingTarget > 0
      ? Math.round(Math.min(100, Math.max(0, (invested / savingTarget) * 100)))
      : 0;

  return (
    <SummarySection title={t(`${T}.title`)}>
      <div className="bg-card border rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
              {t(`${T}.total`)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`${T}.description`)}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg font-bold tabular-nums">
            {currencyNumber(invested)}
          </p>
        </div>
        <div className="mt-3">
          <ProgressBar value={progress} max={100} />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
          {t(`${T}.progress`, {
            progress,
            target: currencyNumber(savingTarget),
          })}
        </p>
      </div>
    </SummarySection>
  );
}