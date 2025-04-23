import { TransactionType } from "../enums/transactionType";

export type Transaction = {
  date: string;
  description: string;
  value: number;
  recurrent: boolean;
  type: TransactionType;
};
