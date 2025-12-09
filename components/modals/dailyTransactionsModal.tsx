import { DayBalance } from "@/core/types/DayBalance";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import SummaryTransactions from "../summaryTransactions";
import { TransactionType } from "@/core/enums/transactionType";
import { currencyNumber } from "@/core/utils/numberFormat";
import { getColors } from "@/core/utils/getColors";
import { useProfile } from "@/app/context/ProfileContext";
import { Transaction } from "@/core/types/Transaction";
import DeleteTransactionModal from "./deleteTransactionModal";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { getDateName } from "@/core/utils/date";
import Button from "../ui/button";

interface DailyTransactionsModalProps {
  dayBalance: DayBalance;
  onClose: () => void;
  open: boolean;
}

export default function DailyTransactionModal({
  dayBalance,
  onClose,
  open,
}: DailyTransactionsModalProps) {
  const { openModal, openModalFilled } = useTransactionModal();
  const { profile } = useProfile();
  const { t } = useTranslation();

  const [transactionClicked, setTransactionClicked] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const closeModal = () => {
    setTransactionClicked(null);
    setTransactionToDelete(null);
    onClose();
  };

  const onEdit = (transaction: Transaction) => {
    openModalFilled(transaction);
  };

  const onDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const onClickTransaction = (transaction: Transaction) => {
    setTransactionClicked(transaction);
  };

  return (
    <>
      <ModalContainer open={open} onClose={onClose}>
        <ModalTitle
          title={getDateName(dayBalance.day, dayBalance.idMonth)}
          onClose={closeModal}
        />

        <div className="flex flex-col">
          {dayBalance?.incomes && dayBalance?.incomes?.length > 0 && (
            <SummaryTransactions
              title={t("transactionType.income")}
              type={TransactionType.income}
              transactions={dayBalance.incomes}
              transactionClicked={transactionClicked}
              onClickTransaction={onClickTransaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {dayBalance?.expenses && dayBalance?.expenses?.length > 0 && (
            <SummaryTransactions
              title={t("transactionType.expense")}
              type={TransactionType.expense}
              transactions={dayBalance.expenses}
              transactionClicked={transactionClicked}
              onClickTransaction={onClickTransaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {dayBalance?.dailies && dayBalance?.dailies?.length > 0 && (
            <SummaryTransactions
              title={t("transactionType.daily")}
              type={TransactionType.daily}
              transactions={dayBalance.dailies}
              transactionClicked={transactionClicked}
              onClickTransaction={onClickTransaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {dayBalance?.investeds && dayBalance?.investeds?.length > 0 && (
            <SummaryTransactions
              title={t("transactionType.investment")}
              type={TransactionType.investment}
              transactions={dayBalance.investeds}
              transactionClicked={transactionClicked}
              onClickTransaction={onClickTransaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {dayBalance.hasEstimatedDailyExpense && (
            <div className="flex flex-row justify-between border-b border-gray-200 pb-3 mb-3">
              <span>Gasto diário planejado</span>
              <span>{currencyNumber(profile.dailyCost)}</span>
            </div>
          )}

          <div className="flex flex-row justify-between font-bold mb-6">
            <span>{t("tooltips.balance")}</span>
            <span className={`${getColors(dayBalance?.total ?? 0, 0, profile.savingTarget, false, false)}`}>
              {currencyNumber(dayBalance?.total ?? 0)}
            </span>
          </div>

          <Button
            variant="contained"
            onClick={() => openModal(dayBalance.idMonth, dayBalance.day)}
          >
            {t("tooltips.addTransaction")}
          </Button>
        </div>
      </ModalContainer>

      <DeleteTransactionModal
        open={transactionToDelete !== null}
        onClose={() => setTransactionToDelete(null)}
        transactionsToDelete={transactionToDelete ? [transactionToDelete] : []}
      />
    </>
  );
}
