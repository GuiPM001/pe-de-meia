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
  console.log(users)

  const today = new Date().toISODateString();
  const pastMonths = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (i + 1));
    return d.toISOString().slice(0, 7) + "-01";
  });
  
  console.log('pastMonths', pastMonths)
  users.forEach(async (user) => {
    const idUser = (user as Profile)._id;

    const transactions = (
      await Promise.all(
        pastMonths.map(m => transactionService.getTransactions(m, idUser, TransactionType.expense, false))
      )
    ).flat();

    const totalDailyCost = transactions.reduce((acc, t) => acc + t.value!, 0);
    
    console.log(transactions.length);
    console.log('tota', totalDailyCost);
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
