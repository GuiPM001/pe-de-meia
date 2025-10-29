import { Profile } from "@/core/types/Profile";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";

export async function ServerProviders({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const tokenData: Profile = jwtDecode(token!);

  const profile: Profile = tokenData;

  return <ClientProviders initialProfile={profile}>{children}</ClientProviders>;
}
