import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import React from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { getMonthNameByDate } from "@/core/utils/date";
import { useMonth } from "@/app/context/MonthContext";
import {
  TbArrowDownRight,
  TbArrowUpRight,
  TbBusinessplan,
  TbPigMoney,
  TbTrendingUp,
  TbWallet,
} from "react-icons/tb";
import { t } from "i18next";
import { getColors } from "@/core/utils/getColors";
import { TransactionType } from "@/core/enums/transactionType";
import { currencyNumber } from "@/core/utils/numberFormat";

interface MonthlyAnalysisModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MonthlyAnalysisModal({
  open,
  onClose,
}: MonthlyAnalysisModalProps) {
  const { transactions } = useTransaction();
  const { profile } = useProfile();
  const { monthSelected } = useMonth();

  const [year] = monthSelected.id.split("-");

  const getStatus = () => {
    if (monthSelected.balance === null) return null;

    const today = new Date();
    const currentMonthPrefix = today.getFullYear() + "-" + String(today.getUTCMonth() + 1).padStart(2, "0") + "-01";
    const isPastMonth = monthSelected.id < currentMonthPrefix;

    if (isPastMonth && (monthSelected.invested ?? 0) >= profile.savingTarget) {
      return t("monthStatus.green");
    }

    const total = monthSelected.balance + (monthSelected.invested ?? 0);

    if (!isPastMonth && monthSelected.balance >= profile.savingTarget)
      return t("monthStatus.green");

    if (!isPastMonth && total >= profile.savingTarget)
      return t("monthStatus.greenWithInvestment");

    if (Number(monthSelected.balance.toFixed(2)) <= 0)
      return t("monthStatus.red");

    return t("monthStatus.yellow");
  };

  const sumValues = (transactionType: TransactionType) => {
    const filteredTransactions = transactions?.filter(
      (x) => x.type === transactionType,
    );

    if (!filteredTransactions) return 0;

    return filteredTransactions.reduce((acc, t) => t.value! + acc, 0);
  };

  const calculatePerformance = () => {
    const totalDailyCost = sumValues(TransactionType.daily);

    const today = new Date();

    if (today.toISOString().slice(0, 7) + "-01" !== monthSelected.id) {
      const [year, month] = monthSelected.id.split('-').map(Number);
      const qtdDaysInMonth = new Date(year, month, 0).getDate();

      return totalDailyCost / qtdDaysInMonth;
    }

    return totalDailyCost / today.getDate();
  };

  const calculateTotalPlannedDailyCost = () => {
    const [year, month] = monthSelected.id.split("-").map(Number);
    const qtdDays = new Date(year, month, 0).getDate();

    return profile.dailyCost * qtdDays;
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalTitle title={t("modal.monthlyAnalysis.title")} onClose={onClose} />
      <div className="text-gray-500 -mt-6 mb-4">
        <span>
          {t("modal.monthlyAnalysis.subTitle")}{" "}
          {getMonthNameByDate(monthSelected.id)} {year}
        </span>
      </div>

      <div
        className={`flex flex-row justify-between rounded-xl px-4 py-4 
          ${(() => {
            const today = new Date();
            const currentMonthPrefix = today.getFullYear() + "-" + String(today.getUTCMonth() + 1).padStart(2, "0") + "-01";
            const isPastMonth = monthSelected.id < currentMonthPrefix;
            return getColors(monthSelected.balance, monthSelected.invested ?? 0, profile.savingTarget, true, true, isPastMonth);
          })()}`}
      >
        <div className="flex flex-row items-center gap-2">
          <TbTrendingUp size="20px" />
          <span className="text-black font-xl">
            {t("modal.monthlyAnalysis.status")}
          </span>
        </div>
        <span className="font-semibold font-xl">{getStatus()}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-4">
        <div className="rounded-xl flex flex-col gap-2 px-3 lg:px-4 py-3 bg-green-default ring ring-green-text/30">
          <div className="flex flex-row gap-2 items-center text-green-text">
            <TbArrowUpRight size="18px" />
            <span className="text-sm text-gray-500">
              {t("modal.monthlyAnalysis.income")}
            </span>
          </div>

          <span className="font-semibold text-lg lg:text-xl text-green-text">
            {currencyNumber(sumValues(TransactionType.income))}
          </span>
        </div>

        <div className="rounded-xl flex flex-col gap-2 px-3 lg:px-4 py-3 bg-red-default ring ring-red-text/30">
          <div className="flex flex-row gap-2 items-center text-red-text">
            <TbArrowDownRight size="18px" />
            <span className="text-sm text-gray-500">
              {t("modal.monthlyAnalysis.expense")}
            </span>
          </div>

          <span className="font-semibold text-lg lg:text-xl text-red-text">
            {currencyNumber(sumValues(TransactionType.fixedExpense) + sumValues(TransactionType.expense))}
          </span>
        </div>

        <div className="rounded-xl flex flex-col gap-2 px-3 lg:px-4 py-3 text-purple-text bg-purple-default ring ring-purple-text/30">
          <div className="flex flex-row gap-2 items-center">
            <TbWallet size="18px" />
            <span className="text-sm text-gray-500">
              {t("modal.monthlyAnalysis.daily")}
            </span>
          </div>

          <span className="font-semibold text-lg lg:text-xl">
            {currencyNumber(sumValues(TransactionType.daily))}
          </span>
        </div>

        <div className="rounded-xl flex flex-col gap-2 px-3 lg:px-4 py-3 bg-gray-100 ring ring-gray-600/30">
          <div className="flex flex-row gap-2 items-center text-gray-600">
            <TbBusinessplan size="18px" />
            <span className="text-sm text-gray-500">
              {t("modal.monthlyAnalysis.performance")}
            </span>
          </div>

          <span className="font-semibold text-lg lg:text-xl text-gray-600">
            {currencyNumber(calculatePerformance())}
          </span>
        </div>

        <div className="col-span-2 rounded-xl flex flex-col gap-2 px-3 lg:px-4 py-3 bg-blue-50 ring ring-blue-400/30">
          <div className="flex flex-row gap-2 items-center text-blue-600">
            <TbPigMoney size="18px" />
            <span className="text-sm text-gray-500">
              {t("modal.monthlyAnalysis.invested", "Investido")}
            </span>
          </div>

          <span className="font-semibold text-lg lg:text-xl text-blue-600">
            {currencyNumber(sumValues(TransactionType.investment))}
          </span>
        </div>
      </div>

      <div className="mt-4 text-gray-500 text-sm flex items-center flex-col">
        <div className="w-full h-[0.5px] bg-gray-300 mb-4" />
        <div className="flex flex-col lg:flex-row text-center lg:gap-2">
          <span>
            {t("modal.monthlyAnalysis.dailyProjected")}: {currencyNumber(calculateTotalPlannedDailyCost())}
          </span>
          <span className="hidden lg:block">|</span>
          <span>
            {t("modal.monthlyAnalysis.realDailyExpense")}: {currencyNumber(sumValues(TransactionType.daily))}
          </span>
        </div>
      </div>
    </ModalContainer>
  );
}
