import React, { useEffect, useState } from "react";
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
import "@/core/utils/date.extensions";
import { useTransaction } from "@/app/context/TransactionContext";

export interface TransactionModalProps {
  onClose: () => void;
  open: boolean;
  idMonth: string;
  day?: number;
}

export default function TransactionModal({
  onClose,
  open,
  idMonth,
  day,
}: TransactionModalProps) {
  const { profile } = useProfile();
  const { transactions, setTransactions } = useTransaction();

  const initialState = {
    date: new Date().toISODateString(),
    description: "",
    recurrent: false,
    type: TransactionType.expense,
    value: 0,
    idUser: "",
    idMonth,
    recurrenceId: null,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<Transaction>(initialState);

  useEffect(() => {
    if (!idMonth) return;

    const initialDay = day ?? new Date().getDate();
    const [year, month] = idMonth.split("-").map(Number);

    setForm({
      ...form,
      idMonth,
      date: new Date(year, month - 1, initialDay).toISODateString(),
    });
  }, [idMonth, day]);

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

      await api.post("/transaction/register", newTransaction);
      setTransactions([...transactions, newTransaction]);

      setLoading(false);
      setForm(initialState);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <ModalContainer open={open}>
      <ModalTitle title="Adicionar transação" onClose={onClose} />

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
          onChange={(e) => handleForm(parseFloat(e.target.value), "value")}
        />
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => handleForm(e.target.value, "type")}
          options={[
            { label: "Entrada", value: TransactionType.income },
            { label: "Saída", value: TransactionType.expense },
          ]}
        />
      </div>

      <div className="flex flex-row gap-6 mb-6 w-1/3">
        <Checkbox
          label={"Recorrente"}
          checked={form.recurrent}
          onChange={(e) => handleForm(e.target.checked, "recurrent")}
        />
      </div>

      <ModalActions
        onClose={onClose}
        onSave={onSave}
        loading={loading}
        saveDisabled={!form.description || !form.date || !form.value}
      />

      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </ModalContainer>
  );
}
