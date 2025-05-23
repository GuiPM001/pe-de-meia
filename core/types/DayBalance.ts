import { TransactionType } from "../enums/transactionType";
import { Transaction } from "./Transaction";

export type DayBalance = {
  day: number;
  idMonth: string;
  description: string;
  incomes: Transaction[] | null;
  expenses: Transaction[] | null;
  dailies: Transaction[] | null;
  total: number | null;
};

export type TransactionDay = { // TODO: excluir type
  idsTransactions: string[];
  value: number;
  description: string;
  type: TransactionType;
  recurrent: boolean;
};
