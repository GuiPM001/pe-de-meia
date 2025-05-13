import { Month } from "../types/Month";
import { connectMongo } from "@/core/db/mongodb";
import { Months } from "@/core/models/months";
import { User } from "@/core/models/user";
import { TransactionType } from "../enums/transactionType";

const getMonthsByIdUser = async (idUser: string, year: number) => {
  await connectMongo();

  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  return await Months.find({
    idUser,
    id: { $gte: startOfYear, $lt: endOfYear },
  });
};

const saveMonth = async (month: Month) => {
  if (month.balance === null || !month.idUser || !month.id)
    throw new Error("Todos os campos são obrigatórios");

  await connectMongo();

  const user = await User.findById({ _id: month.idUser });

  if (!user)
    throw new Error("É necessário um usuário cadastrado cadastrar um mês");

  const monthRegistered = await Months.findOne({ id: month.id, idUser: month.idUser });

  if (monthRegistered)
    throw new Error("Mês ja cadastrado para usuario.");

  return await Months.create(month);
};

const saveMonthsNewUser = async (idUser: string) => {
  await connectMongo();

  const now = new Date();
  const actualYear = now.getFullYear();
  const actualMonth = now.getMonth();

  for (let i = 0; i < 6; i++) {
    const id = new Date(actualYear, actualMonth + i, 1).toISOString();

    await Months.create({ idUser, id, balance: 0 });
  }
};

const getMonthByIdUser = async (idMonth: string, idUser: string) => {

  await connectMongo();

  return await Months.findOne({
    idUser,
    id: idMonth
  });
}

const updateMonthBalance = async (idMonth: string, idUser: string, monthBalance: number, recurrent: TransactionType) => {
  await connectMongo();

  var month = await getMonthByIdUser(idUser, idMonth);

  if (!month)
    throw new Error("Mês não existente para ser atualizado.");

  switch (recurrent) {
    case TransactionType.income:
      month.balance += monthBalance
      break;
    case TransactionType.expense:
      month.balance -= monthBalance
      break;
  }

  await Months.findOneAndUpdate(
    { id: idMonth, idUser },
    { $set: { balance: month.balance } },
    { new: true }
  ).exec();
}

export const monthService = { saveMonth, saveMonthsNewUser, getMonthsByIdUser, updateMonthBalance };
