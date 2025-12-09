import { Profile } from "@/core/types/Profile";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";
import { userService } from "@/core/services/user.service";

export async function ServerProviders({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  let profile: Profile = { _id: "", name: "", savingTarget: 0, email: "", dailyCost: 0 };

  if (userId) {
    const response = await userService.get(userId);
    profile = response;
  }

  return <ClientProviders initialProfile={profile}>{children}</ClientProviders>;
}
