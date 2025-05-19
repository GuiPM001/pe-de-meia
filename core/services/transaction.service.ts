import { connectMongo } from "@/core/db/mongodb";
import { Transactions } from "../models/transactions";
import { Transaction } from "../types/Transaction";
import { monthService } from "./month.service";
import { User } from "../models/user";
import { TransactionType } from "../enums/transactionType";
import { Month } from "../types/Month";
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

  const months = await monthService.getFutureMonthsByIdUser(idUser, idMonth);

  if (transaction.recurrent) {
    await handleRecurrentTransaction(transaction, months);
    return;
  }

  await handleSingleTransaction(transaction, months);
};

const handleRecurrentTransaction = async (
  transaction: Transaction,
  months: Month[]
) => {
  const [year, month, day] = transaction.date.split("-").map(Number);
  const baseMonth = month - 1;
  const recurrenceId = crypto.randomUUID();

  const transactionsToInsert = months.map((month, index) => {
    const indexMonth = baseMonth + index;

    return {
      ...transaction,
      recurrenceId,
      recurrent: true,
      idMonth: new Date(Date.UTC(year, indexMonth, 1)).toISODateString(),
      date: new Date(Date.UTC(year, indexMonth, day)).toISODateString(),
    };
  });

  await Transactions.insertMany(transactionsToInsert);

  let accumulatedValue = transaction.value;
  for (const month of months) {
    const updatedTransaction = { ...transaction, value: accumulatedValue };
    await monthService.updateMonthBalance(
      month,
      transaction.idUser,
      updatedTransaction
    );
    accumulatedValue += transaction.value;
  }
};

const handleSingleTransaction = async (
  transaction: Transaction,
  months: Month[]
) => {
  await Transactions.create(transaction);

  await Promise.all(
    months.map(async (month) => {
      await monthService.updateMonthBalance(
        month,
        transaction.idUser,
        transaction
      );
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

  await Transactions.deleteMany({
    _id: { $in: transactionDay.idsTransactions },
  });

  const months = await monthService.getFutureMonthsByIdUser(idUser, idMonth);

  await months.forEach(async (month) => {
    const transactionIdMonth = new Date(idMonth);
    const monthTransaction = transactionIdMonth.getMonth();
    const monthIdDate = new Date(month.id);
    const monthId = monthIdDate.getMonth();

    if (monthId >= monthTransaction) {
      await monthService.updateMonthBalance(month, idUser, {
        idMonth: month.id,
        value: transactionDay.value,
        type: transactionDay.type,
      });
    }
  });
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
    !transactionNew.recurrent &&
    !transactionNew.value &&
    !transactionNew.type
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
        // await updateTransactionsRecurrents(transaction, months);
        return;
      case false:
        await updateRecurringTransactionInstances(
          transactionNew,
          transaction,
          months,
          idTransaction
        );
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

const updateRecurringTransactionInstances = async (
  transactionNew: Transaction,
  transactionOld: Transaction,
  months: Month[],
  idTransaction: string
) => {
  await deleteFutureTransactions(transactionOld, idTransaction);
  await Transactions.findByIdAndUpdate(idTransaction, {
    $set: transactionNew,
  });

  const incrementValue = transactionOld.value;
  let hasSwitchedType = false;
  for (const month of months) {
    if (month.id !== transactionOld.idMonth) {
      transactionOld.value += incrementValue;

      if (!hasSwitchedType) {
        transactionNew.type =
          transactionNew.type == TransactionType.income
            ? TransactionType.expense
            : TransactionType.income;

        hasSwitchedType = true;
      }

      transactionNew.value = transactionOld.value;
    }
    await monthService.updateMonthBalance(
      month,
      transactionOld.idUser,
      transactionNew
    );
  }
};

export const transactionService = {
  registerTransaction,
  getTransactionsByMonthId,
  deleteTransaction,
  updateTransaction,
};
