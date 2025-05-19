import { TransactionType } from "../enums/transactionType";

export type DayBalance = {
  day: number;
  idMonth: string;
  description: string;
  income: TransactionDay | null;
  expense: TransactionDay | null;
  daily: TransactionDay | null;
  total: number | null;
};

export type TransactionDay = {
  idsTransactions: string[];
  value: number;
  description: string;
  type: TransactionType
}