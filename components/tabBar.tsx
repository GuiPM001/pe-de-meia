import { useState } from "react";
import { Wallet, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const TabBar = () => {
  const [active, setActive] = useState("calendar");
  const { t } = useTranslation();

  const tabs = [
  { id: "finance", label: t('tabbar.finance'), icon: Wallet },
  { id: "calendar", label: t('tabbar.calendar'), icon: CalendarDays },
  { id: "profile", label: t('tabbar.profile'), icon: User },
];

  return (
    <nav className="bg-background fixed bottom-0 inset-x-0 z-50 glass border-t pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch gap-8 px-4 pt-2 pb-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => setActive(id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-primary shadow-card text-white font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn(
                  isActive
                    ? "h-6 w-6"
                    : "h-5 w-5",
                )}
                strokeWidth={isActive ? 2.6 : 1.8} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;
