import React, { useEffect, useMemo, useState } from "react";
import Input from "../ui/input";
import CurrencyInput from "../ui/currencyInput";
import { TransactionType } from "@/core/enums/transactionType";
import Select from "../ui/select";
import Checkbox from "../ui/checkbox";
import { Transaction } from "@/core/types/Transaction";
import ModalContainer from "./modalContainer";
import ModalActions from "./modalActions";
import ModalTitle from "./modalTitle";
import { useProfile } from "@/app/context/ProfileContext";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { api } from "@/core/services/api";
import { useTransaction } from "@/app/context/TransactionContext";
import "@/core/utils/date.extensions";

export interface TransactionModalProps {
  onClose: () => void;
  open: boolean;
  idMonth: string;
  day?: number;
  transaction?: Transaction;
}

export default function TransactionModal({
  onClose,
  open,
  idMonth,
  day,
  transaction,
}: TransactionModalProps) {
  const { profile } = useProfile();
  const { transactions, setTransactions } = useTransaction();

  const initialState = useMemo(() => {
    const initialDay = day ?? new Date().getDate();

    const actualDate = !!idMonth ? idMonth : new Date().toISODateString();
    const [year, month] = actualDate.split("-").map(Number);

    return {
      date: new Date(year, month - 1, initialDay).toISODateString(),
      description: "",
      recurrent: false,
      type: TransactionType.expense,
      value: 0,
      idUser: "",
      idMonth,
      recurrenceId: null,
      _id: undefined
    };
  }, [idMonth, day]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<Transaction>(transaction ?? initialState);

  useEffect(() => {
    setForm(transaction ?? initialState);
  }, [transaction, initialState]);

  const handleForm = (
    value: string | boolean | number | TransactionType,
    name: string
  ) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSave = async () => {
    try {
      setLoading(true);

      const newTransaction = {
        ...form,
        idUser: profile._id,
        type: parseInt(form.type.toString()),
      };

      const response: Transaction = await api.post("/transaction", newTransaction);
      setTransactions([...transactions, response]);

      setLoading(false);
      setForm(initialState);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  const onEdit = async () => {
    try {
      setLoading(true); 
      
      const response: Transaction = await api.put("/transaction", form);
      const newTransactions = transactions.filter(t => t._id !== response._id);

      setTransactions([...newTransactions, response]);

      setLoading(false);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setForm(transaction ?? initialState);
    onClose();
  };

  return (
    <ModalContainer open={open}>
      <ModalTitle
        title={`${!!transaction ? "Editar" : "Salvar"} transação`}
        onClose={onClose}
      />

      <div className="flex flex-row gap-6 mb-6">
        <Input
          label="Descrição"
          value={form.description}
          onChange={(e) => handleForm(e.target.value, "description")}
        />
        <Input
          label="Data"
          value={form.date}
          type="date"
          onChange={(e) => handleForm(e.target.value, "date")}
        />
      </div>

      <div className="flex flex-row gap-6 mb-6">
        <CurrencyInput
          label="Valor"
          value={form.value}
          onValueChange={(floatValue) => handleForm(floatValue, "value")}
        />
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => handleForm(e.target.value, "type")}
          disabled={!!transaction}
          options={[
            { label: "Entrada", value: TransactionType.income },
            { label: "Saída", value: TransactionType.expense },
            { label: "Investimento", value: TransactionType.investment },
          ]}
        />
      </div>

      <div className="flex flex-row gap-6 mb-6 w-1/3">
        <Checkbox
          label="Recorrente"
          checked={form.recurrent}
          disabled={!!transaction || form.type == TransactionType.investment}
          onChange={(e) => handleForm(e.target.checked, "recurrent")}
        />
      </div>

      <ModalActions
        onClose={() => closeModal()}
        onSave={!!transaction ? onEdit : onSave}
        loading={loading}
        saveDisabled={!form.description || !form.date || !form.value}
      />

      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </ModalContainer>
  );
}
