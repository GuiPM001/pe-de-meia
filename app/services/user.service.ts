import { api } from "./api";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";
import { RegisterRequest } from "../types/RegisterRequest";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  return await api.post("/login", request);
};

const register = async (request: RegisterRequest) => {
  return await api.post("/user", request);
};

export const userService = {
  login,
  register
};
