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