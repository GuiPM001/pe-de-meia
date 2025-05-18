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
  idsTransaction: string[];
  value: number;
  description: string;
}