import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";
import { transactionService } from "./transaction.service";
import { TransactionType } from "../enums/transactionType";
import "@/core/utils/date.extensions";
import { monthService } from "./month.service";

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

  const today = new Date();
  const qtdDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const pastMonths = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (i + 1));
    return d.toISOString().slice(0, 7) + "-01";
  });

  for (const user of users) {
    const idUser = (user as Profile)._id;

    const transactions = await transactionService.getTransactions(
      pastMonths,
      idUser,
      TransactionType.expense,
      false
    );

    const totalDailyCost = transactions.reduce((acc, t) => acc + t.value!, 0);

    if (totalDailyCost <= 0) continue;

    const previousDailyCost = user.dailyCost;

    user.dailyCost = Math.floor(totalDailyCost / pastMonths.length / qtdDays);
    await user.save();
    
    const futureMonths = await monthService.getFutureMonthsByIdUser(idUser, today.toISOString().slice(0, 7) + "-01");
    for (const month of futureMonths) {
      const newBalance = (month.balance ?? 0) - ((user.dailyCost - previousDailyCost) * qtdDays);
      await monthService.updateMonthBalanceDailyCost(month.id, idUser, newBalance);
    }
  }
};

export const userService = {
  update,
  get,
  updateDailyCost,
};
