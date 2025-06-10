import { Month } from "../types/Month";
import { connectMongo } from "@/core/db/mongodb";
import { Months } from "@/core/models/months";
import { User } from "@/core/models/user";
import { TransactionType } from "../enums/transactionType";
import { Transaction } from "../types/Transaction";
import { transactionService } from "./transaction.service";
import { SupportedLocale, t } from "@/lib/errorHandler";
import "@/core/utils/date.extensions";

const getMonthsByIdUser = async (idUser: string, year: number) => {
  await connectMongo();

  const startOfYear = new Date(year, 0, 1).toISODateString();
  const endOfYear = new Date(year + 1, 0, 1).toISODateString();

  return await Months.find({
    idUser,
    id: { $gte: startOfYear, $lt: endOfYear },
  });
};

const getFutureMonthsByIdUser = async (
  idUser: string,
  idMonth: string
): Promise<Month[]> => {
  await connectMongo();

  return await Months.find({
    idUser,
    id: { $gte: idMonth },
  });
};

const saveMonth = async (month: Month, locale: SupportedLocale) => {
  if (month.balance === null || !month.idUser || !month.id)
    throw new Error(t(locale, "errors.month.fieldRequired"));

  await connectMongo();

  const user = await User.findById({ _id: month.idUser });

  if (!user)
    throw new Error(t(locale, "errors.user.userNotFound"));

  const monthRegistered = await Months.findOne({
    id: month.id,
    idUser: month.idUser,
  });

  if (monthRegistered) throw new Error(t(locale, "errors.month.alreadyExist"));

  const [newMonth] = await Promise.all([
    Months.create(month),
    transactionService.registerRecurrentTransactionsNewMonth(month),
  ]);

  return newMonth;
};

const saveMonthsNewUser = async (idUser: string) => {
  await connectMongo();

  const now = new Date();
  const actualYear = now.getFullYear();
  const actualMonth = now.getUTCMonth();

  for (let i = 0; i < 6; i++) {
    const id = new Date(actualYear, actualMonth + i, 1).toISODateString();

    await Months.create({ idUser, id, balance: 0, invested: 0 });
  }
};

const updateMonthBalance = async (
  month: Month,
  transaction: Pick<Transaction, "type" | "value" | "idUser" | "idMonth">,
  isDelete: boolean
) => {
  await connectMongo();
  let totalInvested = month.invested;

  if (transaction.type === TransactionType.investment && transaction.idMonth === month.id) {
    totalInvested = isDelete
      ? month.invested! - transaction.value
      : month.invested! + transaction.value;
  }

  const totalBalance = getTotalBalance(transaction, month, isDelete);

  await Months.updateOne(
    { id: month.id, idUser: transaction.idUser },
    { $set: { balance: totalBalance, invested: totalInvested } },
    { new: true }
  );
};

const getTotalBalance = (
  transaction: Pick<Transaction, "type" | "value">,
  month: Month,
  isDelete: boolean
) => {
  if (
    (transaction.type === TransactionType.income && isDelete) ||
    (transaction.type === TransactionType.expense && !isDelete) || 
    (transaction.type === TransactionType.investment && !isDelete)
  )
    return month.balance! - transaction.value;

  return month.balance! + transaction.value;
};

const getMonthById = async (idUser: string, idMonth: string) => {
  await connectMongo();

  return await Months.findOne({
    id: idMonth,
    idUser,
  });
};

export const monthService = {
  saveMonth,
  saveMonthsNewUser,
  getMonthsByIdUser,
  getFutureMonthsByIdUser,
  updateMonthBalance,
  getMonthById,
};
