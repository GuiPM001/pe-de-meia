import React, { useState } from "react";
import Checkbox from "../ui/checkbox";
import ModalContainer from "./modalContainer";
import ModalActions from "./modalActions";
import ModalTitle from "./modalTitle";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { api } from "@/core/services/api";
import { useTransaction } from "@/app/context/TransactionContext";
import { Transaction } from "@/core/types/Transaction";
import "@/core/utils/date.extensions";

interface DeleteTransactionModalProps {
  onClose: () => void;
  open: boolean;
  transactionsToDelete: Transaction[];
}

export default function DeleteTransactionModal({
  onClose,
  open,
  transactionsToDelete,
}: DeleteTransactionModalProps) {
  const { transactions, setTransactions } = useTransaction();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [deleteRecurrent, setDeleteRecurrent] = useState<boolean>(false);

  const confirm = async () => {
    try {
      setLoading(true);

      await api.delete("/transaction", {
        data: {
          transactions: transactionsToDelete,
          deleteRecurrent,
        },
      });

      filterTransactions();
      setLoading(false);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (deleteRecurrent) {
      const idsTransactions = transactionsToDelete.map((t) => t.recurrenceId);
      setTransactions(
        transactions.filter((x) => !idsTransactions.includes(x.recurrenceId))
      );
    } else {
      const idsTransactions = transactionsToDelete.map((t) => t._id);
      setTransactions(
        transactions.filter((x) => !idsTransactions.includes(x._id))
      );
    }
  };

  return (
    <ModalContainer open={open}>
      <ModalTitle title="Excluir transação" onClose={onClose} />

      <div className="flex flex-col text-start mb-6">
        <p>
          Confirmar exclusão da(s) transação(ções):{" "}
          <span className="font-bold">
            {transactionsToDelete.map((t) => t.description).join(" | ")}
          </span>
        </p>

        <p>
          Com valor total de{" "}
          <span className="font-bold">
            R$
            {transactionsToDelete
              .reduce((acc, t) => acc + t.value, 0)
              .toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
          </span>
        </p>
      </div>

      {transactionsToDelete.every((t) => t.recurrent) && (
        <div className="flex flex-row gap-6 mb-6 w-1/3">
          <Checkbox
            label="Excluir recorrência"
            checked={deleteRecurrent}
            onChange={(e) => setDeleteRecurrent(e.target.checked)}
          />
        </div>
      )}

      <ModalActions
        onClose={onClose}
        onSave={confirm}
        loading={loading}
        saveDisabled={false}
        labelSaveButton="Confirmar"
      />

      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </ModalContainer>
  );
}
