import React from "react";
import { useTranslation } from "react-i18next";

export default function Legend() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row lg:flex-col items-center justify-center gap-10 lg:gap-4 mt-6 pt-4 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-default border border-green-text" />
          <span className="text-xs text-gray-500">{t("monthStatus.green")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-default border border-yellow-text" />
          <span className="text-xs text-gray-500">{t("monthStatus.yellow")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-default border border-red-text" />
          <span className="text-xs text-gray-500">{t("monthStatus.red")}</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-1 lg:gap-4">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-green-text" />
          <span className="text-xs text-gray-500">{t("transactionType.income")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-red-text" />
          <span className="text-xs text-gray-500">{t("transactionType.fixedExpense")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-yellow-text" />
          <span className="text-xs text-gray-500">{t("transactionType.daily")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-blue-text" />
          <span className="text-xs text-gray-500">{t("transactionType.investment")}</span>
        </div>
      </div>
    </div>
  );
}
