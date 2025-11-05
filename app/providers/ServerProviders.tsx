import { Profile } from "@/core/types/Profile";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";

export async function ServerProviders({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  let profile: Profile = { _id: "", name: "", savingTarget: 0, email: "" };

  if (token) {
    const tokenData: Profile = jwtDecode(token!);
    profile = tokenData;
  }

  return <ClientProviders initialProfile={profile}>{children}</ClientProviders>;
}
