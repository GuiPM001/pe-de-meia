import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";
import { TransactionDay } from "../types/DayBalance";
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
    throw new Error("É necessário um usuário cadastrado para cadastrar um mês");

  if (transaction.recurrent) {
    await handleRecurrentTransaction(transaction);
    return;
  }

  await handleSingleTransaction(transaction);
};

const handleRecurrentTransaction = async (transaction: Transaction) => {
  const months = await monthService.getFutureMonthsByIdUser(
    transaction.idUser,
    transaction.idMonth
  );

  const [year, month, day] = transaction.date.split("-").map(Number);
  const baseMonth = month - 1;
  const recurrenceId = crypto.randomUUID();

  const transactionsToInsert = months.map((month, index) => {
    const indexMonth = baseMonth + index;

    return {
      ...transaction,
      recurrenceId,
      idMonth: new Date(Date.UTC(year, indexMonth, 1)).toISODateString(),
      date: new Date(Date.UTC(year, indexMonth, day)).toISODateString(),
    };
  });

  await Transactions.insertMany(transactionsToInsert);

  let accumulatedValue = transaction.value;
  for (const month of months) {
    const updatedTransaction = { ...transaction, value: accumulatedValue };
    await monthService.updateMonthBalance(month, updatedTransaction);
    accumulatedValue += transaction.value;
  }
};

const handleSingleTransaction = async (
  transaction: Pick<Transaction, "type" | "value" | "idUser" | "idMonth">,
  idsToDelete?: string[]
) => {
  const months = await monthService.getFutureMonthsByIdUser(
    transaction.idUser,
    transaction.idMonth
  );

  if (idsToDelete) {
    await Transactions.deleteMany({
      _id: { $in: idsToDelete },
    });
  } else {
    await Transactions.create(transaction);
  }

  await Promise.all(
    months.map(async (month) => {
      await monthService.updateMonthBalance(month, transaction);
    })
  );
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

const deleteTransaction = async (
  transactionDay: TransactionDay,
  deleteRecurrent: boolean,
  idUser: string,
  idMonth: string
) => {
  await connectMongo();

  if (deleteRecurrent) {
    return;
  }

  const transaction = {
    value: -transactionDay.value,
    type: transactionDay.type,
    idUser,
    idMonth,
  };

  await handleSingleTransaction(transaction, transactionDay.idsTransactions);
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
  deleteTransaction
};
