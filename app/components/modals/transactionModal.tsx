import React, { useState } from "react";
import Input from "../core/input";
import CurrencyInput from "../core/currencyInput";
import { TransactionType } from "../../enums/transactionType";
import Select from "../core/select";
import Checkbox from "../core/checkbox";
import { Transaction } from "../../types/Transaction";
import ModalContainer from "./modalContainer";
import ModalActions from "./modalActions";
import ModalTitle from "./modalTitle";

interface TransactionModalProps {
  onClose: () => void;
}

export default function TransactionModal({ onClose }: TransactionModalProps) {
  const [form, setForm] = useState<Transaction>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurrent: false,
    type: TransactionType.daily,
    value: 0,
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

  const onSave = () => {
    console.log(form);
    onClose();
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
          onChange={(e) => handleForm(e.target.value, "value")}
        />
        <Select
          label="Tipo"
          value={form.type}
          onChange={(e) => handleForm(e.target.value, "type")}
          options={[
            { label: "Entrada", value: TransactionType.income },
            { label: "Saída", value: TransactionType.expense },
            { label: "Gasto diário", value: TransactionType.daily },
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
        saveDisabled={!form.description || !form.date || !form.value}
      />
    </ModalContainer>
  );
}
