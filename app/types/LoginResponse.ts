import { Profile } from "./Profile";

export type LoginResponse = {
  token: string;
  user: Profile
}