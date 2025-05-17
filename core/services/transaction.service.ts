import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";
import "@/core/utils/date.extensions";
import { Month } from "../types/Month";

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

      const [year, month, day] = transaction.date.split("-").map(Number);
      const baseYear = year;
      const baseMonth = month - 1;
      const recurrenceId = crypto.randomUUID();

      for (let i = 0; i < months.length; i++) {
        const date = new Date(Date.UTC(baseYear, baseMonth + i, 1));

        transactionsToInsert.push({
          ...transaction,
          idMonth: date.toISOString().split("T")[0],
          recurrent: true,
          date: new Date(Date.UTC(baseYear, baseMonth + i, day))
            .toISOString()
            .split("T")[0],
          recurrenceId: recurrenceId,
        });
      }

      await Transactions.insertMany(transactionsToInsert);
      const incrementValue = transaction.value;

      for (const month of months) {
        if (month.id !== transaction.idMonth) {
          transaction.value += incrementValue;
        }
        await monthService.updateMonthBalance(
          month,
          transaction.idUser,
          transaction
        );
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
          await monthService.updateMonthBalance(
            month,
            transaction.idUser,
            transaction
          );
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

const updateTransaction = async (
  idTransaction: string,
  transactionNew: Transaction
) => {
  if (!idTransaction)
    throw new Error(
      "É necessario informar o id da transação para atualizar a transação."
    );

  if (
    (!transactionNew.recurrent, !transactionNew.value, !transactionNew.type)
  ) {
    throw new Error(
      "É necessario informar os campos obrigatorios para concluir a atualização da transação"
    );
  }

  await connectMongo();
  const transaction = await Transactions.findById({ _id: idTransaction });
  const months = await monthService.getFutureMonthsByIdUser(
    transaction.idUser,
    transaction.idMonth
  );

  if (transaction.recurrenceId) {
    switch (transactionNew.recurrent) {
      case true:
        transaction.description = transactionNew.description;
        transaction.value = transactionNew.value;
        transaction.recurrent = transactionNew.recurrent;
        transaction.date = transactionNew.date;
        transaction.type = transactionNew.type;
        await registerTransaction(transaction);
        await updateTransactionsRecurrents(transaction, months);
        return;
      case false:
        await deleteFutureTransactions(transaction, idTransaction);
        await updateMonthBalanceNoRecurrent(transaction, months);
        console.log(transactionNew);
        await Transactions.findByIdAndUpdate(idTransaction, {
          $set: transactionNew,
        });

        break;
    }
  }
};

const deleteFutureTransactions = async (
  transaction: Transaction,
  idTransaction: string
) => {
  await connectMongo();
  await Transactions.deleteMany({
    recurrenceId: transaction.recurrenceId,
    _id: { $ne: idTransaction },
  });
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
  deleteTransaction,
  updateTransaction,
};
