import React, { useState } from "react";
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

interface TransactionModalProps {
  onClose: () => void;
  idMonth: string;
}

export default function TransactionModal({
  onClose,
  idMonth,
}: TransactionModalProps) {
  const { profile } = useProfile();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<Transaction>({
    date: new Date().toIsoDateString(),
    description: "",
    recurrent: false,
    type: TransactionType.expense,
    value: 0,
    idUser: "",
    idMonth,
  });

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

      await api.post("/transaction/register", { ...form, idUser: profile._id });

      setLoading(false);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <ModalContainer>
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
