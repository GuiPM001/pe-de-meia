import React, { useState } from "react";
import {
  Plus,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import DeleteTransactionModal from "@/components/modals/deleteTransactionModal";

import { useTranslation } from "react-i18next";
import { useTransactionModal } from "@/app/context/TransactionModalContext";
import { useProfile } from "@/app/context/ProfileContext";

import { DayBalance } from "@/core/types/DayBalance";
import { Transaction } from "@/core/types/Transaction";
import { getTransactionProps } from "@/core/constants/transactionProps";

import { currencyNumber } from "@/core/utils/numberFormat";
import { getDateName } from "@/core/utils/date";
import { cn } from "@/lib/utils";
import { getGoalStatus, getStatusStyles } from "@/core/utils/goalStyle";

interface DaySummaryProps {
  selectedDay: DayBalance | undefined;
}

export default function DaySummary({ selectedDay }: DaySummaryProps) {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const { openModal, openModalFilled } = useTransactionModal();
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const transactionProps = getTransactionProps(t);

  if (!selectedDay) {
    return (
      <section className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="skeleton h-7 w-40 rounded-lg" />
          <div className="skeleton h-9 w-28 rounded-xl" />
        </div>

        <div className="skeleton h-[72px] w-full rounded-2xl" />

        <div className="skeleton h-[200px] w-full rounded-2xl" />
      </section>
    );
  }

  const goalStatus = getGoalStatus(selectedDay.idMonth, selectedDay.total, profile.savingTarget, undefined, undefined, true);

  return (
    <section className="mt-4 space-y-2">
      <div className="flex items-center justify-between w-full">
        <h3 className="font-display text-lg font-semibold text-foreground min-w-3/5">
          {getDateName(selectedDay.day, selectedDay.idMonth)}
        </h3>
        <Button onClick={() => openModal(selectedDay.idMonth, selectedDay.day)}>
          <Plus className="w-4 h-4" /> Transação
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">
          {t("daySummary.balance")}
        </p>
        <p
          className={cn(
            getStatusStyles(goalStatus, false),
            "font-display text-2xl font-bold bg-transparent"
          )}
        >
          {currencyNumber(selectedDay.total!)}
        </p>
      </div>

      <ul className="bg-card border rounded-2xl divide-y">
        {selectedDay.hasEstimatedDailyExpense && (
          <li className="flex items-center gap-3 p-4 bg-muted/20">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-dashed border-muted-foreground/40 text-muted-foreground/70">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground italic truncate">
                {t("daySummary.expected")}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {t("daySummary.expectedDescription")}
              </p>
            </div>
            <span className="text-sm font-medium text-muted-foreground italic">
              {currencyNumber(profile.dailyCost)}
            </span>
          </li>
        )}

        {selectedDay.transactions.map((t) => {
          const { icon: Icon, cls } = transactionProps[t.type];
          return (
            <li key={t._id} className="group flex items-center gap-3 p-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  cls,
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {t.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transactionProps[t.type].label}
                </p>
              </div>
              <span className="text-sm font-semibold">
                {currencyNumber(t.value!)}
              </span>
              <div className="flex items-center">
                <IconButton
                  onClick={() => openModalFilled(t)}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <Pencil className="w-4 h-4" />
                </IconButton>
                <IconButton
                  onClick={() => setTransactionToDelete(t)}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-expense hover:bg-expense/10"
                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            </li>
          );
        })}
      </ul>

      <DeleteTransactionModal
        open={transactionToDelete !== null}
        onClose={() => setTransactionToDelete(null)}
        transactionsToDelete={transactionToDelete ? [transactionToDelete] : []}
      />
    </section>
  );
}
