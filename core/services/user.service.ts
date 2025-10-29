import { Profile } from "../types/Profile";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";

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

export const userService = {
  update,
  get,
};
