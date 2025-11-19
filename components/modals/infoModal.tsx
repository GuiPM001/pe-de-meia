import React from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";

interface InfoModalProps {
  onClose: () => void;
  open: boolean;
}

export default function InfoModal({ onClose, open }: InfoModalProps) {
  const { t } = useTranslation();
  
  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalTitle title={t('modal.info.title')} onClose={onClose} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-green-text"></div>
            <span>{t('modal.info.green')}</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-red-text"></div>
            <span>{t('modal.info.red')}</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-yellow-text"></div>
            <span>{t('modal.info.yellow')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center">
            <TbCaretUpFilled className="text-green-text" size="24px" />
            <span>{t('transactionType.income')}</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <TbCaretDownFilled className="text-red-text" size="24px" />
            <span>{t('transactionType.fixedExpense')}</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <TbCaretDownFilled className="text-yellow-text" size="24px" />
            <span>{t('transactionType.daily')}</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="h-1.5 w-3.5 mx-[5px] rounded-xl bg-blue-default"></div>
            <span>{t('transactionType.investment')}</span>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
