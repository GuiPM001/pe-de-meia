import React from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { Transaction } from "@/core/types/Transaction";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import "@/core/utils/date.extensions";
import Button from "../ui/button";

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

  return (
    <ModalContainer open={open}>
      <ModalTitle
        title="Selecione uma transação para editar"
        onClose={onClose}
      />

      <div className="flex flex-col text-start">
        <div className="flex flex-row justify-between p-2">
          <span className="w-4/6 text-start text-gray-400 font-semibold text-sm">
            Descrição
          </span>

          <span className="w-2/6 text-center text-gray-400 font-semibold text-sm">
            Valor
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
              R${" "}
              {t.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={onClose} variant="ghost" color="confirm">
          Concluir
        </Button>
      </div>
    </ModalContainer>
  );
}
