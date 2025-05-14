import { Month } from "../types/Month";
import { connectMongo } from "@/core/db/mongodb";
import { Months } from "@/core/models/months";
import { User } from "@/core/models/user";
import { TransactionType } from "../enums/transactionType";
import { Transaction } from "../types/Transaction";
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

const saveMonth = async (month: Month) => {
  if (month.balance === null || !month.idUser || !month.id)
    throw new Error("Todos os campos são obrigatórios");

  await connectMongo();

  const user = await User.findById({ _id: month.idUser });

  if (!user)
    throw new Error("É necessário um usuário cadastrado cadastrar um mês");

  const monthRegistered = await Months.findOne({
    id: month.id,
    idUser: month.idUser,
  });

  if (monthRegistered) throw new Error("Mês ja cadastrado para usuario.");

  return await Months.create(month);
};

const saveMonthsNewUser = async (idUser: string) => {
  await connectMongo();

  const now = new Date();
  const actualYear = now.getFullYear();
  const actualMonth = now.getUTCMonth();

  for (let i = 0; i < 6; i++) {
    const id = new Date(actualYear, actualMonth + i, 1).toISODateString();

    await Months.create({ idUser, id, balance: 0 });
  }
};

const updateMonthBalance = async (
  month: Month,
  idUser: string,
  transaction: Transaction
) => {
  await connectMongo();

  const totalBalance =
    transaction.type == TransactionType.income
      ? month.balance! + transaction.value
      : month.balance! - transaction.value;

  await Months.updateOne(
    { id: month.id, idUser },
    { $set: { balance: totalBalance } },
    { new: true }
  );
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
