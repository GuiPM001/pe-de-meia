import { connectMongo } from "../db/mongodb";
import { RegisterRequest } from "../types/RegisterRequest";
import { SupportedLocale, t } from "@/lib/errorHandler";
import { User } from "../models/user";
import { monthService } from "./month.service";
import bcrypt from "bcryptjs";
import { LoginResponse } from "../types/LoginResponse";
import { LoginRequest } from "../types/LoginRequest";
import jwt from "jsonwebtoken";

const login = async (
  request: LoginRequest,
  locale: SupportedLocale
): Promise<LoginResponse> => {
  const { email, password } = request;

  if (!email || !password) throw new Error(t(locale, "errors.loginRequest"));

  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) throw new Error(t(locale, "errors.user.userNotFound"));

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    throw new Error(t(locale, "errors.user.incorrectPassword"));

  const token = jwt.sign(
    {
      _id: user._id
    },
    process.env.JWT_SECRET!,
    { expiresIn: "365d" }
  );

  return { token, user };
};

const register = async (request: RegisterRequest, locale: SupportedLocale) => {
  const { name, email, password, savingTarget, dailyCost } = request;

  if (!name || !email || !password)
    throw new Error(t(locale, "errors.user.registerRequest"));

  await connectMongo();

  const userRegistered = await User.findOne({ email });

  if (userRegistered)
    throw new Error(t(locale, "errors.user.emailAlreadyRegister"));

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    savingTarget,
    dailyCost
  });

  await monthService.saveMonthsNewUser(user._id, dailyCost);
};

export const authService = {
  login,
  register,
};
