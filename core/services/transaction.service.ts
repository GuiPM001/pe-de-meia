import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";
import "@/core/utils/date.extensions";

const registerTransaction = async (transaction: Transaction) => {
  const { date, value, description, idUser, idMonth } = transaction;

  if (!value || !date || !description || !idUser || !idMonth)
    throw new Error(
      "É necessario preencher todos os campos para cadastrar uma transação."
    );

  await connectMongo();
  const user = await User.findById({ _id: idUser });

  if (!user)
    throw new Error("É necessário um usuário cadastrado cadastrar um mês");

  const months = await monthService.getFutureMonthsByIdUser(idUser, idMonth);

  switch (transaction.recurrent) {
    case true:
      const transactionsToInsert = [];
      const originalDate = new Date(transaction.date);
      const month = originalDate.getUTCMonth();

      for (let i = 0; i < months.length; i++) {
        const futureDate = new Date(originalDate);
        futureDate.setMonth(month + i);
        futureDate.setDate(1);

        transactionsToInsert.push({
          ...transaction,
          idMonth: futureDate.toISODateString(),
          recurrent: true,
        });
      }

      await Transactions.insertMany(transactionsToInsert);

      await months.forEach(async (month) => {
        await monthService.updateMonthBalance(month, idUser, transaction);
      });

      break;

    case false:
      await Transactions.create(transaction);
      await months.forEach(async (month) => {
        await monthService.updateMonthBalance(month, idUser, transaction);
      });
  }
};

const getTransactionsByMonthId = async (
  idMonth: string,
  idUser: string
): Promise<Transaction[]> => {
  if (!idMonth)
    throw new Error(
      "É necessario informar um més para retornar as transações."
    );

  return await Transactions.find({ idMonth, idUser });
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
};
