import { Transaction } from "../types/Transaction";

export const sumValues = (arr: Transaction[]) =>
  arr.reduce((acc, { value }) => acc + value, 0);
