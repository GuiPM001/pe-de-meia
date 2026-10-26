import React from "react";
import { useTranslation } from "react-i18next";

export default function Legend() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-between mt-4 pt-3 border-t">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-success/25 border border-success/40" />
        <span className="text-[10px] text-gray-500">{t("statuses.above.label")}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-warning/25 border border-warning/40" />
        <span className="text-[10px] text-gray-500">{t("statuses.below.label")}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-expense/20 border border-expense/40" />
        <span className="text-[10px] text-gray-500">{t("statuses.negative.label")}</span>
      </div>
    </div>
  );
}
