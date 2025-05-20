import { LoginRequest } from "@/core/types/LoginRequest";
import { LoginResponse } from "@/core/types/LoginResponse";
import { RegisterRequest } from "@/core/types/RegisterRequest";
import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";
import { monthService } from "./month.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const { email, password } = request;

  if (!email || !password) throw new Error("Email e senha obrigatórios");

  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuário não encontrado");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Senha incorreta");

  const token = jwt.sign(
    { ...user, _id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { token, user };
};

const register = async (request: RegisterRequest) => {
  const { name, email, password, savingTarget } = request;

  if (!name || !email || !password)
    throw new Error("Preencha todos os campos para concluir o cadastro");

  await connectMongo();

  const userRegistered = await User.findOne({ email });

  if (userRegistered) throw new Error("Email já cadastrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    savingTarget,
  });

  await monthService.saveMonthsNewUser(user._id);
};

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

  if (!user) throw new Error("Usuário não encontrado.");

  return user;
};

export const userService = {
  login,
  register,
  update,
  get,
};
