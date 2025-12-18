"use client";

import { useEffect, useState } from "react";
import { useTransaction } from "@/app/context/TransactionContext";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";

import Calendar from "@/components/calendar";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Wrapper from "@/components/ui/wrapper";

import "@/core/utils/date.extensions";

export default function Home() {
  const today = new Date();

  const { monthSelected, getMonths, months } = useMonth();
  const { getTransactions } = useTransaction();
  const { profile } = useProfile();

  const [loading, setLoading] = useState({
    sidebar: true,
    calendar: true,
  });

  const [yearSelected, setYearSelected] = useState<number>(today.getFullYear());

  const loadMonths = async () => {
    setLoading((prev) => ({ ...prev, sidebar: true }));
    await getMonths(yearSelected, profile._id);
    setLoading((prev) => ({ ...prev, sidebar: false }));
  };

  const loadTransactions = async () => {
    setLoading((prev) => ({ ...prev, calendar: true }));
    await getTransactions(monthSelected.id, profile._id);
    setLoading((prev) => ({ ...prev, calendar: false }));
  };

  useEffect(() => {
    if (!profile?._id) return;

    loadMonths();
  }, [yearSelected, profile?._id]);

  useEffect(() => {
    if (!months.length || !profile?._id || !monthSelected?.id) return;
    loadTransactions();
  }, [monthSelected?.id, profile?._id]);

  const handleChangeYear = (newYear: number) => {
    setYearSelected(newYear);
  };

  return (
    <Wrapper>
      <div className="flex flex-row gap-8">
        <Sidebar
          yearSelected={yearSelected}
          handleChangeYear={handleChangeYear}
          loading={loading.sidebar}
        />

        <div className="flex flex-col w-full h-full">
          <Header yearSelected={yearSelected} />

          <Calendar loading={loading.calendar} />
        </div>
      </div>
    </Wrapper>
  );
}
