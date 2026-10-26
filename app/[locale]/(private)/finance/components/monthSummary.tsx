"use client";

import React, { useEffect } from "react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { useTransaction } from "@/app/context/TransactionContext";
import { Month } from "@/core/types/Month";
import { GoalStatus } from "@/core/utils/goalStyle";
import { MonthAvailability } from "../finance.types";
import { MonthHeader } from "./monthHeader";
import { CostOfLivingCard } from "./cards/costOfLivingCard";
import { DailyPlanningCard } from "./cards/dailyPlanningCard";
import { InvestmentsCard } from "./cards/investmentsCard";
import { TransactionTotals } from "./transactionTotals";

interface MonthSummaryProps {
  getGoalStatus: (
    month: Month | undefined,
    availability: MonthAvailability,
  ) => GoalStatus;
}

export default function MonthSummary({ getGoalStatus }: MonthSummaryProps) {
  const { monthSelected } = useMonth();
  const { profile } = useProfile();
  const { getTransactions } = useTransaction();

  useEffect(() => {
    if (monthSelected?.id && profile?._id) {
      getTransactions(monthSelected.id, profile._id);
    }
  }, [monthSelected?.id, profile?._id, getTransactions]);

  return (
    <div className="space-y-6">
      <MonthHeader getGoalStatus={getGoalStatus} />
      <CostOfLivingCard />
      <DailyPlanningCard />
      <InvestmentsCard />
      <TransactionTotals />
    </div>
  );
}