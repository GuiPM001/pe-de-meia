import { api } from "./api";
import { LoginRequest } from "@/core/types/LoginRequest";
import { LoginResponse } from "@/core/types/LoginResponse";
import { RegisterRequest } from "@/core/types/RegisterRequest";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  return await api.post("/user/login", request);
};

const register = async (request: RegisterRequest) => {
  return await api.post("/user/register", request);
};

export const userService = {
  login,
  register
};
