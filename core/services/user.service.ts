import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";
import { transactionService } from "./transaction.service";
import { TransactionType } from "../enums/transactionType";
import "@/core/utils/date.extensions";

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

const updateDailyCost = async () => {
  await connectMongo();

  const users = await User.find();

  const today = new Date().toISODateString();
  const [year, month] = today.split('-').map(Number);

  const pastMonths = [
    `${year}-${month - 1}-01`,
    `${year}-${month - 2}-01`,
    `${year}-${month - 3}-01`
  ];
  
  users.forEach(async (user) => {
    const idUser = (user as Profile)._id;

    const transactions = (
      await Promise.all(
        pastMonths.map(m => transactionService.getTransactions(m, idUser, TransactionType.expense, false))
      )
    ).flat();

    const totalDailyCost = transactions.reduce((acc, t) => acc + t.value!, 0);
    
    if (totalDailyCost <= 0) return;
    
    user.dailyCost = totalDailyCost / pastMonths.length;
    await user.save();
  });
}

export const userService = {
  update,
  get,
  updateDailyCost
};
