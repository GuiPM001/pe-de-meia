import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongo } from "@/core/db/mongodb";
import { userService } from "@/core/services/user.service";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        token.userId = session.userId;
        token.savingTarget = session.savingTarget;
        token.dailyCost = session.dailyCost;
        token.exists = session.exists;

        return token;
      }

      if (account && user && user.email) {
        await connectMongo();

        const dbUser = await userService.getByEmail(user.email);

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.savingTarget = dbUser.savingTarget;
          token.dailyCost = dbUser.dailyCost;
          token.exists = true;
        } else {
          token.exists = false;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.savingTarget = token.savingTarget;
        session.user.dailyCost = token.dailyCost;
        session.user.exists = token.exists as boolean;
      }

      return session;
    },
  },
};