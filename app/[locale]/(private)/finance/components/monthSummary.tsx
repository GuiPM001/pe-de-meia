"use client";

import React, { useEffect } from "react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { MonthHeader } from "./monthHeader";
import { CostOfLivingCard } from "./cards/costOfLivingCard";
import { DailyPlanningCard } from "./cards/dailyPlanningCard";
import { InvestmentsCard } from "./cards/investmentsCard";
import { TransactionTotals } from "./transactionTotals";

export default function MonthSummary() {
  const { monthSelected } = useMonth();
  const { profile } = useProfile();
  const { getTransactions, transactions } = useTransaction();

  useEffect(() => {
    if (!monthSelected?.id || !profile?._id) return;

    if (transactions === null || transactions[0]?.idMonth !== monthSelected.id) {
      getTransactions(monthSelected.id, profile._id);
    }
  }, [monthSelected?.id, profile?._id, getTransactions]);

  return (
    <div className="space-y-6">
      <MonthHeader />
      <DailyPlanningCard />
      <CostOfLivingCard />
      <InvestmentsCard />
      <TransactionTotals />
    </div>
  );
}
