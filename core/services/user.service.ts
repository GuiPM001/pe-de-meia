import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";
import { monthService } from "./month.service";
import { transactionService } from "./transaction.service";
import { TransactionType } from "../enums/transactionType";

const update = async (request: Profile) => {
  const { _id, name, savingTarget } = await request;

  await connectMongo();

  const user = await User.findById(_id);

  user.name = name;
  user.savingTarget = savingTarget;

  await user.save();
};

const get = async (idUser: string): Promise<Profile> => {
  await connectMongo();

  const user = await User.findById(idUser).select("-password");

  return user;
};

const updateDailyCost = async (idUser: string) => {
  await connectMongo();

  const user = await User.findById(idUser);
  if (!user) return;

  const qtdMonths = 3;
  
  const pastMonths = (await monthService.getAllMonthsByIdUser(idUser))
    .filter(m => new Date(m.id) < new Date())
    .reverse()
    .slice(0, qtdMonths);
  
  let totalDailyCost = 0;
  for (let i = 0; i < pastMonths.length; i++) {
    const transactions = await transactionService.getTransactions(pastMonths[i].id, idUser, TransactionType.expense, false);
    
    if (!transactions) continue;
    
    totalDailyCost += transactions.reduce((acc, t) => t.value! + acc, 0)
  }

  if (totalDailyCost <= 0) return;

  user.dailyCost = totalDailyCost / qtdMonths;
  await user.save();
}

export const userService = {
  update,
  get,
  updateDailyCost
};
