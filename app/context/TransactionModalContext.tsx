"use client";

import TransactionModal, {
  TransactionModalProps,
} from "@/components/modals/transactionModal";
import { Transaction } from "@/core/types/Transaction";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface TransactionModalContextProps {
  open: boolean;
  openModal: (idMonth: string, day?: number) => void;
  openModalFilled: (transaction: Transaction) => void;
}

const TransactionModalContext = createContext<TransactionModalContextProps>({
  open: false,
  openModal: () => {},
  openModalFilled: () => {},
});

export const TransactionModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const initialProps = {
    idMonth: "",
    day: undefined,
  };

  const [open, setOpen] = useState<boolean>(false);
  const [modalProps, setModalProps] =
    useState<Pick<TransactionModalProps, "idMonth" | "day" | "transaction">>(
      initialProps
    );

  const openModal = (idMonth: string, day?: number) => {
    setModalProps({ idMonth, day });
    setOpen(true);
  };

  const openModalFilled = (transaction: Transaction) => {
    setOpen(true);
    setModalProps({
      idMonth: transaction.idMonth,
      day: parseInt(transaction.date.split("-")[0]),
      transaction,
    });
  };

  return (
    <TransactionModalContext.Provider
      value={{ open, openModal, openModalFilled }}
    >
      {children}

      <TransactionModal
        {...modalProps}
        open={open}
        onClose={() => setOpen(false)}
      />
    </TransactionModalContext.Provider>
  );
};

export const useTransactionModal = () => {
  const context = useContext(TransactionModalContext);
  return context;
};
