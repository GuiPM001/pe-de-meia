import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";

const registerTransaction = async (transaction: Transaction) => {
  const { date, value, description, type, idUser, idMonth } = transaction;

  if (!value || !date || !description || !type || !idUser || !idMonth)
    throw new Error(
      "É necessario preencher todos os campos para cadastrar uma transação."
    );

  await connectMongo();

  const user = await User.findById({ _id: idUser });

  if (!user)
    throw new Error("É necessário um usuário cadastrado cadastrar um mês");

  switch (transaction.recurrent) {
    case true:
      const originalDate = new Date(transaction.date);
      const month = originalDate.getUTCMonth();

      const transactionsToInsert = [];

      for (let i = 0; i < 12; i++) {
        const futureDate = new Date(originalDate);
        futureDate.setMonth(month + i);
        transactionsToInsert.push({
          ...transaction,
          date: futureDate.toISOString(),
          recurrent: true,
        });
      }

      await Transactions.insertMany(transactionsToInsert);
      break;

    case false:
      await Transactions.create(transaction);
      break;
  }

  const months = await monthService.getFutureMonthsByIdUser(idUser, idMonth);

  await months.forEach(async (month) => {
    await monthService.updateMonthBalance(month, idUser, transaction);
  });
};

export const transactionService = { registerTransaction };
