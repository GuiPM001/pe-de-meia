import { Transaction } from "./Transaction";

export type DayBalance = {
  day: number;
  idMonth: string;
  incomes: Transaction[] | null;
  expenses: Transaction[] | null;
  dailies: Transaction[] | null;
  investeds: Transaction[] | null;
  total: number | null;
  totalInvested: number | null;
};