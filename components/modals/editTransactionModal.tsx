import React from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { Transaction } from "@/core/types/Transaction";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import "@/core/utils/date.extensions";
import Button from "../ui/button";
import { useTranslation } from "react-i18next";
import { currencyNumber } from "@/core/utils/numberFormat";

interface EditTransactionModalProps {
  transactions: Transaction[];
  onClose: () => void;
  open: boolean;
}

export default function EditTransactionModal({
  onClose,
  open,
  transactions,
}: EditTransactionModalProps) {
  const { openModalFilled } = useTransactionModal();
  const { t } = useTranslation();

  return (
    <ModalContainer open={open}>
      <ModalTitle
        title={t('modal.selectTransaction.title')}
        onClose={onClose}
      />

      <div className="flex flex-col text-start">
        <div className="flex flex-row justify-between p-2">
          <span className="w-4/6 text-start text-gray-400 font-semibold text-sm">
            {t('modal.selectTransaction.description')}
          </span>

          <span className="w-2/6 text-center text-gray-400 font-semibold text-sm">
            {t('modal.selectTransaction.value')}
          </span>
        </div>

        {transactions.map((t) => (
          <button
            key={t._id}
            onClick={() => openModalFilled(t)}
            className="flex flex-row p-2 cursor-pointer hover:bg-gray-200 hover:rounded-md border-t border-gray-300"
          >
            <span className="w-4/6 text-start">{t.description}</span>

            <span className="w-2/6 text-center">
              {currencyNumber(t.value)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={onClose} variant="ghost" color="confirm">
          {t('modal.selectTransaction.button')}
        </Button>
      </div>
    </ModalContainer>
  );
}
