import React, { useState } from "react";
import Input from "./core/input";
import Button from "./core/button";
import CurrencyInput from "./core/currencyInput";
import { TransactionType } from "../enums/transactionType";
import Select from "./core/select";
import DateInput from "./core/dateInput";
import Checkbox from "./core/checkbox";
import { Transaction } from "../types/Transaction";

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

  const save = () => {
    console.log(form);
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen bg-gray-800/75 w-full items-center justify-center">
      <div className="w-full max-w-[570px] rounded-xl py-8 px-10 bg-white">
        <h3 className="text-2xl font-bold mb-8">Adicionar transação</h3>

        <div className="flex flex-row gap-6 mb-6">
          <Input
            label="Descrição"
            value={form.description}
            onChange={(e) => handleForm(e.target.value, "description")}
          />
          <DateInput
            label="Data"
            value={form.date}
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

        <div className="flex gap-6 w-full pt-6">
          <Button onClick={onClose} variant="ghost" color="cancel">
            Cancelar
          </Button>
          <Button
            onClick={save}
            disabled={!form.description || !form.date || !form.value}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
