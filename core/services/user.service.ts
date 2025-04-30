import { api } from "./api";
import { LoginRequest } from "@/core/types/LoginRequest";
import { LoginResponse } from "@/core/types/LoginResponse";
import { RegisterRequest } from "@/core/types/RegisterRequest";
import { Profile } from "../types/Profile";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  return await api.post("/user/login", request);
};

const register = async (request: RegisterRequest) => {
  return await api.post("/user/register", request);
};

const update = async (request: Profile) => {
  return await api.put("/user/update", request);
}

const get = async (idUser: string): Promise<Profile> => {
  return await api.get(`/user?id=${idUser}`);
}

export const userService = {
  login,
  register,
  update,
  get
};
