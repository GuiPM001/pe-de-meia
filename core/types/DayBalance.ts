import { Transaction } from "./Transaction";

export type MonthlySummary = {
  dayBalances: DayBalance[];
  remainingDailyExpenses: number;
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
  totalInvested: number | null;
};