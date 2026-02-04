"use client";

import { useEffect, useState, useRef } from "react";
import { useTransaction } from "@/app/context/TransactionContext";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";

import Calendar from "@/components/calendar/calendar";
import Sidebar from "@/components/sidebar";
import Wrapper from "@/components/ui/wrapper";
import MobileMonthSelector from "@/components/mobileMonthSelector";

import "@/core/utils/date.extensions";

export default function Home() {
  const today = new Date();

  const { monthSelected, getMonths } = useMonth();
  const { getTransactions } = useTransaction();
  const { profile, fetchProfile } = useProfile();

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

      Promise.all([
        getMonths(yearSelected, profile._id),
        fetchProfile(profile.email),
      ]);

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
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar
          yearSelected={yearSelected}
          handleChangeYear={handleChangeYear}
          loading={loading.sidebar}
        />

        <MobileMonthSelector
          month={monthSelected}
          year={yearSelected}
          savingTarget={profile.savingTarget}
          handleChangeYear={handleChangeYear}
          loading={loading.sidebar}
        />

        <Calendar loading={loading.calendar} yearSelected={yearSelected} />
      </div>
    </Wrapper>
  );
}
