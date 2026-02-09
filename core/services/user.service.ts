import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { ProfileDocument, User } from "@/core/models/user";
import { transactionService } from "./transaction.service";
import { TransactionType } from "../enums/transactionType";
import { monthService } from "./month.service";
import { RegisterRequest } from "../types/RegisterRequest";
import { SupportedLocale, t } from "@/lib/errorHandler";
import { Transaction } from "../types/Transaction";
import { getDaysFromMonthId, getDaysInMonth, getPastMonths } from "../utils/date";
import "@/core/utils/date.extensions";

const create = async (request: RegisterRequest, locale: SupportedLocale) => {
  const { name, email, savingTarget, dailyCost } = request;

  if (!savingTarget || !dailyCost) {
    throw new Error(t(locale, "errors.user.insuficientData"));
  }

  await connectMongo();

  const user = await User.create({
    name,
    email,
    savingTarget,
    dailyCost,
  });

  await monthService.saveMonthsNewUser(user._id, dailyCost);

  return user._id.toString();
};

const update = async (request: Profile) => {
  const { _id, name, savingTarget } = await request;

  await connectMongo();

  const user = await User.findById(_id);

  user.name = name;
  user.savingTarget = savingTarget;

  await user.save();
};

const getByEmail = async (email: string): Promise<Profile | null> => {
  await connectMongo();

  const user = await User.findOne({ email }).lean<Profile>();

  if (!user) return null;

  return {
    ...user,
    _id: user._id.toString(),
  };
};

const updateDailyCost = async () => {
  await connectMongo();

  const users: ProfileDocument[] = await User.find();

  for (const user of users) {
    await calculateDailyCost(user);
    await updateFutureMonths(user);
  }
};

const calculateDailyCost = async (user: ProfileDocument) => {
  const qtdDays = getDaysInMonth();
  const pastMonths = getPastMonths(3);

  const transactions = await transactionService.getTransactions(pastMonths, user._id, TransactionType.expense, false);

  const totalDailyCost = transactions.reduce((acc, t) => acc + t.value!, 0);

  user.dailyCost = Math.floor(totalDailyCost / pastMonths.length / qtdDays);
  await user.save();
}

const updateFutureMonths = async (user: ProfileDocument) => {
  const today = new Date();
  const idMonth = today.toISOString().slice(0, 7) + "-01";

  const [futureMonths, lastMonth] = await Promise.all([
    monthService.getFutureMonthsByIdUser(user.id, idMonth), 
    monthService.getLastMonth(idMonth, user._id)
  ]);

  let lastBalance = lastMonth.balance ?? 0;

  for (const futureMonth of futureMonths) {
    const qtdDaysMonth = getDaysFromMonthId(futureMonth.id);

    const transactions: Transaction[] = await transactionService.getTransactionsByMonthId(futureMonth.id,  user._id, "en");
    
    const totalTransaction = transactions.reduce((acc, v) => {
      if (v.type === TransactionType.income) 
        return acc + v.value!;
      
      return acc - v.value!;
    }, 0);
    
    const newBalance = (lastBalance + totalTransaction - (user.dailyCost * qtdDaysMonth));
    
    await monthService.updateMonthBalanceDailyCost(futureMonth.id, user.id, newBalance);
    
    lastBalance = newBalance;
  }
}

const getAll = async () => {
  await connectMongo();
  return await User.find();
};

export const userService = {
  create,
  update,
  getByEmail,
  updateDailyCost,
  getAll,
};
