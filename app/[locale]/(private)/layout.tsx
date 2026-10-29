"use client";

import { ReactNode } from "react";
import Wrapper from "@/components/ui/wrapper";
import { TabNavProvider, useTabNav } from "@/app/context/TabNavContext";
import HomePage from "./(calendar)/page";
import FinancePage from "./finance/page";
import ProfilePage from "./profile/page";

function PrivatePages() {
  const { tab } = useTabNav();

  return (
    <Wrapper>
      <div className={tab === "calendar" ? "contents" : "hidden"}>
        <HomePage />
      </div>
      <div className={tab === "finance" ? "contents" : "hidden"}>
        <FinancePage />
      </div>
      <div className={tab === "profile" ? "contents" : "hidden"}>
        <ProfilePage />
      </div>
    </Wrapper>
  );
}

export default function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TabNavProvider>
      <PrivatePages />
      <div className="hidden">{children}</div>
    </TabNavProvider>
  );
}
