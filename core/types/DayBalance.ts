import { Transaction } from "./Transaction";

export type MonthlySummary = {
  totalInvested: number;
  dayBalances: DayBalance[];
}

export type DayBalance = {
  day: number;
  idMonth: string;
  description: string;
  incomes: Transaction[] | null;
  expenses: Transaction[] | null;
  dailies: Transaction[] | null;
  investeds: Transaction[] | null;
  total: number | null;
};