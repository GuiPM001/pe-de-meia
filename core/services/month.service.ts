import { Month } from "../types/Month";
import { connectMongo } from "@/core/db/mongodb";
import { Months } from "@/core/models/months";
import { User } from "@/core/models/user";
import { TransactionType } from "../enums/transactionType";
import { Transaction } from "../types/Transaction";
import { transactionService } from "./transaction.service";
import { SupportedLocale, t } from "@/lib/errorHandler";
import "@/core/utils/date.extensions";
import { Profile } from "../types/Profile";

const getMonthsByIdUser = async (idUser: string, year: number) => {
  await connectMongo();

  const startOfYear = new Date(year, 0, 1).toISODateString();
  const endOfYear = new Date(year + 1, 0, 1).toISODateString();

  return await Months.find({
    idUser,
    id: { $gte: startOfYear, $lt: endOfYear },
  });
};

const getAllMonthsByIdUser = async (idUser: string): Promise<Month[]> => {
  await connectMongo();
  
  return await Months.find({ idUser });
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

  const user: Profile | null = await User.findById({ _id: month.idUser });

  if (!user)
    throw new Error(t(locale, "errors.user.userNotFound"));

  const monthRegistered = await Months.findOne({
    id: month.id,
    idUser: month.idUser,
  });

  if (monthRegistered) throw new Error(t(locale, "errors.month.alreadyExist"));

  const updatedMonth = await transactionService.registerRecurrentTransactionsNewMonth(month);
  
  const [year, actualMonth] = month.id.split('-').map(Number);
  const qtdDaysInMonth = new Date(year, actualMonth, 0).getDate();
  
  updatedMonth.balance! -= (user.dailyCost * qtdDaysInMonth);

  await Months.create(updatedMonth);
  return updatedMonth;
};

const saveMonthsNewUser = async (idUser: string, dailyCost: number) => {
  await connectMongo();

  const now = new Date();
  const actualYear = now.getFullYear();
  const actualMonth = now.getUTCMonth();

  let actualBalance = 0;
  
  for (let i = 0; i < 6; i++) {
    let qtdDaysInMonth = new Date(actualYear, (actualMonth + 1 + i), 0).getDate();
    
    if (i === 0)
      qtdDaysInMonth -= now.getUTCDate() - 1;

    actualBalance -= (dailyCost * qtdDaysInMonth);
    
    const id = new Date(actualYear, actualMonth + i, 1).toISODateString();
    await Months.create({ idUser, id, balance: actualBalance, invested: 0 });

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
      ? month.invested! - transaction.value!
      : month.invested! + transaction.value!;
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
    return month.balance! - transaction.value!;

  return month.balance! + transaction.value!;
};

const getMonthById = async (idUser: string, idMonth: string) => {
  await connectMongo();

  return await Months.findOne({
    id: idMonth,
    idUser,
  });
};

const updateMonthBalanceDailyCost = async (idMonth: string, idUser: string, newBalance: number) => {
  await Months.updateOne(
    { id: idMonth, idUser: idUser },
    { $set: { balance: newBalance }}
  )
}

export const monthService = {
  saveMonth,
  saveMonthsNewUser,
  getMonthsByIdUser,
  getAllMonthsByIdUser,
  getFutureMonthsByIdUser,
  updateMonthBalance,
  getMonthById,
  updateMonthBalanceDailyCost
};
