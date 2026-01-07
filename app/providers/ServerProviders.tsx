import { Profile } from "@/core/types/Profile";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";

export async function ServerProviders({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("profile")?.value;
  
  let profile: Profile = { _id: "", name: "", savingTarget: 0, email: "", dailyCost: 0 };

  if (profileCookie) {
    profile = JSON.parse(profileCookie);
  }

  return <ClientProviders initialProfile={profile}>{children}</ClientProviders>;
}
