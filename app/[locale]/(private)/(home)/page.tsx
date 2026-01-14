"use client";

import { useEffect, useState, useRef } from "react";
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

  const { monthSelected, getMonths } = useMonth();
  const { getTransactions } = useTransaction();
  const { profile } = useProfile();

  const [yearSelected, setYearSelected] = useState<number>(today.getFullYear());
  const [loading, setLoading] = useState({
    sidebar: true,
    calendar: true,
  });

  const lastLoadedMonthRef = useRef<string | null>(null);

  useEffect(() => {
    if (!profile._id) return;

    const loadMonths = async () => {
      setLoading((prev) => ({ ...prev, sidebar: true }));
      await getMonths(yearSelected, profile._id);
      setLoading((prev) => ({ ...prev, sidebar: false }));
    };

    loadMonths();
  }, [yearSelected, profile._id]);

  useEffect(() => {
    if (loading.sidebar || !profile._id || !monthSelected?.id) return;

    if (monthSelected.id === lastLoadedMonthRef.current) return;

    const loadTransactions = async () => {
      lastLoadedMonthRef.current = monthSelected.id;
      setLoading((prev) => ({ ...prev, calendar: true }));
      await getTransactions(monthSelected.id, profile._id);
      setLoading((prev) => ({ ...prev, calendar: false }));
    };

    loadTransactions();
  }, [monthSelected?.id, profile._id, loading.sidebar]);

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

        <div className="flex flex-col w-full h-full bg-white lg:rounded-2xl lg:shadow-sm lg:px-6 lg:py-4">
          <Header
            yearSelected={yearSelected}
            handleChangeYear={handleChangeYear}
            loading={loading.sidebar}
          />

          <Calendar loading={loading.calendar} />
        </div>
      </div>
    </Wrapper>
  );
}
