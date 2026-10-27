"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type AppTab = "calendar" | "finance" | "profile";

function tabFromPath(pathname: string): AppTab {
  if (pathname.includes("/finance")) return "finance";
  if (pathname.includes("/profile")) return "profile";
  return "calendar";
}

interface TabNavContextProps {
  tab: AppTab;
  setTab: (tab: AppTab) => void;
}

const TabNavContext = createContext<TabNavContextProps>({
  tab: "calendar",
  setTab: () => {},
});

export function TabNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [tab, setTab] = useState<AppTab>(() => tabFromPath(pathname));

  useEffect(() => {
    setTab(tabFromPath(pathname));
  }, [pathname]);

  const value = useMemo(() => ({ tab, setTab }), [tab]);

  return (
    <TabNavContext.Provider value={value}>{children}</TabNavContext.Provider>
  );
}

export const useTabNav = () => useContext(TabNavContext);
