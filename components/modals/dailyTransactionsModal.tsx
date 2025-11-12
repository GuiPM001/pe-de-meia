import { DayBalance } from "@/core/types/DayBalance";
import React from "react";
import { useTranslation } from "react-i18next";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import SummaryTransactions from "../summaryTransactions";
import { TransactionType } from "@/core/enums/transactionType";
import { currencyNumber } from "@/core/utils/numberFormat";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";

interface DailyTransactionsModalProps {
  dayBalance: DayBalance | null;
  onClose: () => void;
  open: boolean;
}

export default function DailyTransactionModal({
  dayBalance,
  onClose,
  open,
}: DailyTransactionsModalProps) {
  // TODO: add delete and edit options
  // const { openModalFilled } = useTransactionModal();
  const { profile } = useProfile();
  const { t } = useTranslation();

  const modalOpen =
    open &&
    dayBalance !== null &&
    ((dayBalance.dailies !== null && dayBalance.dailies.length > 0) ||
      (dayBalance.incomes !== null && dayBalance.incomes.length > 0) ||
      (dayBalance.expenses !== null && dayBalance.expenses.length > 0) ||
      (dayBalance.investeds !== null && dayBalance.investeds.length > 0));

  return (
    <ModalContainer open={modalOpen}>
      <ModalTitle
        title={`
          ${t("modal.dailyTransactions.title")} 
          ${dayBalance?.day.toString().padStart(2, "0")}
        `}
        onClose={onClose}
      />

      <div className="flex flex-col gap-10">
        {dayBalance?.incomes && dayBalance?.incomes?.length > 0 && (
          <SummaryTransactions
            title={t("transactionType.income")}
            type={TransactionType.income}
            transactions={dayBalance.incomes}
          />
        )}

        {dayBalance?.expenses && dayBalance?.expenses?.length > 0 && (
          <SummaryTransactions
            title={t("transactionType.expense")}
            type={TransactionType.expense}
            transactions={dayBalance.expenses}
          />
        )}

        {dayBalance?.dailies && dayBalance?.dailies?.length > 0 && (
          <SummaryTransactions
            title={t("transactionType.daily")}
            type={TransactionType.daily}
            transactions={dayBalance.dailies}
          />
        )}

        {dayBalance?.investeds && dayBalance?.investeds?.length > 0 && (
          <SummaryTransactions
            title={t("transactionType.investment")}
            type={TransactionType.investment}
            transactions={dayBalance.investeds}
          />
        )}

        <div className="flex flex-row justify-between font-bold">
          <span>{t("tooltips.balance")}</span>
          <span className={`${getColors(dayBalance?.total ?? 0, 0, profile.savingTarget, false, false)}`}>
            {currencyNumber(dayBalance?.total ?? 0)}
          </span>
        </div>
      </div>
    </ModalContainer>
  );
}
