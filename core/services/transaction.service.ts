import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";
import { ObjectId } from "mongodb";
import { Month } from "../types/Month";
import { TransactionType } from "../enums/transactionType";
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
    return await handleRecurrentTransaction(transaction, false);
  }

  return await handleSingleTransaction(transaction, false);
};

const handleRecurrentTransaction = async (
  transaction: Transaction,
  isDelete: boolean
) => {
  const months: Month[] = await monthService.getFutureMonthsByIdUser(
    transaction.idUser,
    transaction.idMonth
  );

  if (isDelete) {
    await Transactions.deleteMany({
      recurrenceId: { $in: transaction.recurrenceId },
      idMonth: { $gte: transaction.idMonth },
    });
    await updateAccumulatedBalanceValue(transaction, months, true);
    return;
  }

  const [year, month, day] = transaction.date.split("-").map(Number);
  const baseMonth = month - 1;

  transaction.recurrenceId = new ObjectId().toString();

  const transactionsToInsert = months.map((_, index) => {
    const indexMonth = baseMonth + index;

    return {
      ...transaction,
      _id: index === 0 ? transaction.recurrenceId : undefined,
      idMonth: new Date(Date.UTC(year, indexMonth, 1)).toISODateString(),
      date: new Date(Date.UTC(year, indexMonth, day)).toISODateString(),
    };
  });

  await Transactions.insertMany(transactionsToInsert);
  await updateAccumulatedBalanceValue(transaction, months, false);

  return transaction;
};

const handleSingleTransaction = async (
  transaction: Transaction,
  isDelete: boolean
) => {
  if (isDelete) {
    await Transactions.deleteOne({
      _id: transaction._id,
    });

    await updateBalanceValue(transaction, isDelete);
    return transaction;
  }

  const newTransaction = await Transactions.create(transaction);
  await updateBalanceValue(transaction, isDelete);

  return newTransaction;
};

const updateBalanceValue = async (
  transaction: Pick<Transaction, "type" | "value" | "idUser" | "idMonth">,
  isDelete: boolean
) => {
  const months: Month[] = await monthService.getFutureMonthsByIdUser(
    transaction.idUser,
    transaction.idMonth
  );

  const promises = months.map((month) =>
    monthService.updateMonthBalance(month, transaction, isDelete)
  );

  await Promise.all(promises);
};

const updateAccumulatedBalanceValue = async (
  transaction: Pick<Transaction, "type" | "value" | "idUser" | "idMonth">,
  months: Month[],
  isDelete: boolean
) => {
  let accumulatedValue = transaction.value;

  for (const month of months) {
    const updatedTransaction = { ...transaction, value: accumulatedValue };
    await monthService.updateMonthBalance(month, updatedTransaction, isDelete);
    accumulatedValue += transaction.value;
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

const deleteTransaction = async (
  transactions: Transaction[],
  deleteRecurrent: boolean
) => {
  await connectMongo();

  for (const transaction of transactions) {
    if (deleteRecurrent) {
      await handleRecurrentTransaction(transaction, true);
      continue;
    }

    await handleSingleTransaction(transaction, true);
  }
};

const updateTransaction = async (transaction: Transaction) => {
  await connectMongo();

  const originalTransaction = await Transactions.findById(transaction._id);

  await Transactions.updateOne({ _id: transaction._id }, { $set: transaction });

  await updateBalanceValue(
    { ...transaction, value: -(originalTransaction.value - transaction.value) },
    false
  );

  return transaction;
};

const getPreviousRecurrentTransactions = async (
  idUser: string,
  idMonth: string
): Promise<Transaction[]> => {
  const [year, month] = idMonth.split("-").map(Number);

  const previousIdMonth = `${year}-${(month - 1)
    .toString()
    .padStart(2, "0")}-01`;

  return Transactions.find({
    idUser,
    recurrent: true,
    idMonth: previousIdMonth,
  });
};

const registerRecurrentTransactionsNewMonth = async (newMonth: Month) => {
  await connectMongo();

  const recurrentTransactions = await getPreviousRecurrentTransactions(
    newMonth.idUser,
    newMonth.id
  );

  if (!recurrentTransactions.length) {
    return;
  }

  recurrentTransactions.forEach((t) => {
    const [y, m, d] = t.date.split("-").map(Number);

    t._id = undefined;
    t.idMonth = newMonth.id;
    t.date = new Date(y, m, d).toISODateString();

    if (t.type === TransactionType.income) newMonth.balance! += t.value;
    else newMonth.balance! -= t.value;
  });

  await Transactions.insertMany(recurrentTransactions);
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
  deleteTransaction,
  updateTransaction,
  registerRecurrentTransactionsNewMonth,
};
