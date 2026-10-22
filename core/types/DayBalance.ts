import { Transaction } from "./Transaction";

export type DayBalance = {
  day: number;
  idMonth: string;
  transactions: Transaction[];
  total: number | null;
  totalInvested: number | null;
  hasEstimatedDailyExpense: boolean;
};