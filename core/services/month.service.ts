import { Month } from "../types/Month";
import { connectMongo } from "@/core/db/mongodb";
import { Months } from "@/core/models/months";
import { User } from "@/core/models/user";

const getMonthsByIdUser = async (idUser: string) => {
  await connectMongo();

  return await Months.find({ idUser });
};

const saveMonth = async (month: Month) => {
  if (month.balance === null || !month.idUser || !month.id) 
    throw new Error("Todos os campos são obrigatórios");

  await connectMongo();

  const user = await User.findById({ _id: month.idUser });

  if (!user)
    throw new Error("É necessário um usuário cadastrado cadastrar um mês");

  const monthRegistered = await Months.findOne({ id: month.id });

  if (monthRegistered)
    throw new Error("Mês ja cadastrado para usuario.");

  await Months.create(month);
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

export const monthService = { saveMonth, saveMonthsNewUser, getMonthsByIdUser };
