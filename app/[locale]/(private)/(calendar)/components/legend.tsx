import React from "react";
import { useTranslation } from "react-i18next";

export default function Legend() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-center gap-8 mt-4 pt-3 border-t">
      <div className="flex items-center gap-1">
        <div className="w-4 h-5 rounded bg-success/25 border border-success/40" />
        <span className="text-xs whitespace-pre-line text-gray-500">{t("monthStatus.green")}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-5 rounded bg-warning/25 border border-warning/40" />
        <span className="text-xs whitespace-pre-line text-gray-500">{t("monthStatus.yellow")}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-5 rounded bg-expense/20 border border-expense/40" />
        <span className="text-xs whitespace-pre-line text-gray-500">{t("monthStatus.red")}</span>
      </div>
    </div>
  );
}
