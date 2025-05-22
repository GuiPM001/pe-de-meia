"use client";

import TransactionModal, {
  TransactionModalProps,
} from "@/components/modals/transactionModal";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface NewTransactionModalContextProps {
  open: boolean;
  openModal: (idMonth: string, day?: number) => void;
}

const NewTransactionModalContext =
  createContext<NewTransactionModalContextProps>({
    open: false,
    openModal: () => {},
  });

export const NewTransactionModalProvider = ({
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
    useState<Pick<TransactionModalProps, "idMonth" | "day">>(initialProps);

  const openModal = (idMonth: string, day?: number) => {
    setOpen(true);
    setModalProps({
      idMonth,
      day,
    });
  };

  return (
    <NewTransactionModalContext.Provider value={{ open, openModal }}>
      {children}
      
      <TransactionModal
        {...modalProps}
        open={open}
        onClose={() => setOpen(false)}
      />
    </NewTransactionModalContext.Provider>
  );
};

export const useNewTransactionModal = () => {
  const context = useContext(NewTransactionModalContext);
  return context;
};
