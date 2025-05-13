import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";

const registerTransaction = async (transaction: Transaction) => {
  const { date, value, description, type, idUser, idMonth } = transaction;

  if (!value || !date || !description || !type || !idUser || !idMonth)
    throw new Error(
      "É necessario preencher todos os campos para cadastrar uma transação."
    );

  await connectMongo();

  await Transactions.create(transaction);
  
  const months = await monthService.getFutureMonthsByIdUser(idUser, idMonth);

  await months.forEach(async (month) => {
    await monthService.updateMonthBalance(month, idUser, transaction);
  });
};

export const transactionService = { registerTransaction };
