import { TransactionType } from "../enums/transactionType";

export type Transaction = {
  _id?: string;
  date: string;
  description: string;
  value: number;
  recurrent: boolean;
  type: TransactionType;
  idUser: string;
  idMonth: string;
  recurrenceId: string | null;
};
