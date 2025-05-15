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
      const monthOriginal = originalDate.getUTCMonth();

      for (let i = 0; i < months.length; i++) {
        const futureDate = new Date(originalDate);
        futureDate.setMonth(monthOriginal + i);
        futureDate.setDate(1);

        transactionsToInsert.push({
          ...transaction,
          idMonth: futureDate.toISODateString(),
          recurrent: true,
        });
      }
      await Transactions.insertMany(transactionsToInsert);

      const incrementValue = transaction.value;

      for (const month of months) {
        if (month.id !== transaction.idMonth) {
          transaction.value += incrementValue;
        }
        await monthService.updateMonthBalance(month, idUser, transaction);
      }

      break;

    case false:
      
      await Transactions.create(transaction);

      await months.forEach(async (month) => {

        const transactionIdMonth = new Date(transaction.idMonth);
        const monthTransaction = transactionIdMonth.getMonth();
        const monthIdDate = new Date(month.id);
        const monthId = monthIdDate.getMonth();

        if (monthId >= monthTransaction) {
          await monthService.updateMonthBalance(month, idUser, transaction);
        }
      });

      break;
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
  await connectMongo();

  return await Transactions.find({ idMonth, idUser });
};

const deleteTransaction = async (idTransaction: string) => {
  if (!idTransaction)
    throw new Error(
      "É necessario informar o id da transação para excluir a transação."
    );

  await connectMongo();

  await Transactions.findByIdAndDelete({ _id: idTransaction });
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
  deleteTransaction,
};
