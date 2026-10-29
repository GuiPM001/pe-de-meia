import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  HandCoins,
  Receipt,
  LucideIcon,
} from "lucide-react";
import { TransactionType } from "@/core/enums/transactionType";
import i18n from "@/lib/i18n";

export type TransactionProps = {
  icon: LucideIcon;
  cls: string;
  label: string;
};

export const getTransactionProps = (
  t: (key: string) => string = (key) => i18n.t(key),
): Record<TransactionType, TransactionProps> => {
  const entries: [TransactionType, TransactionProps][] = [
    [
      TransactionType.income,
      {
        icon: ArrowDownLeft,
        cls: "bg-success/15 text-success",
        label: t("transactionType.income"),
      },
    ],
    [
      TransactionType.fixedExpense,
      {
        icon: ArrowUpRight,
        cls: "bg-expense/15 text-expense",
        label: t("transactionType.fixedExpense"),
      },
    ],
    [
      TransactionType.daily,
      {
        icon: Coffee,
        cls: "bg-daily-expense/15 text-daily-expense",
        label: t("transactionType.daily"),
      },
    ],
    [
      TransactionType.expense,
      {
        icon: Receipt,
        cls: "bg-warning/15 text-warning",
        label: t("transactionType.others"),
      },
    ],
    [
      TransactionType.investment,
      {
        icon: HandCoins,
        cls: "bg-investment/15 text-investment",
        label: t("transactionType.investment"),
      },
    ],
  ];

  const target = Object.fromEntries(entries) as Record<
    TransactionType,
    TransactionProps
  >;
  const order = entries.map(([type]) => String(type));

  return new Proxy(target, {
    ownKeys() {
      return order;
    },
    getOwnPropertyDescriptor(t, prop) {
      return {
        value: t[prop as unknown as TransactionType],
        enumerable: true,
        configurable: true,
        writable: true,
      };
    },
  });
};

export const transactionProps = getTransactionProps();
