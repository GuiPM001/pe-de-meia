import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      exists: boolean;
      savingTarget?: number;
      dailyCost?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    exists?: boolean;
    savingTarget?: number;
    dailyCost?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    exists?: boolean;
    savingTarget?: number;
    dailyCost?: number;
  }
}
