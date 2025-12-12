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

  const { monthSelected, getMonths } = useMonth();
  const { getTransactions } = useTransaction();
  const { profile } = useProfile();

  const [loading, setLoading] = useState<boolean>(false);

  const [yearSelected, setYearSelected] = useState<number>(today.getFullYear());

  useEffect(() => {
    fetchData();
  }, [monthSelected.id, yearSelected]);

  const fetchData = async () => {
    setLoading(true);

    await Promise.all([
      getMonths(yearSelected, profile._id),
      getTransactions(monthSelected.id, profile._id),
    ]);

    setLoading(false);
  };

  return (
    <Wrapper>
      <div className="flex flex-row gap-8">
        <Sidebar
          yearSelected={yearSelected}
          setYearSelected={setYearSelected}
        />

        <div className="flex flex-col w-full h-full">
          <Header yearSelected={yearSelected} />

          <Calendar month={monthSelected} loading={loading} />
        </div>
      </div>
    </Wrapper>
  );
}
