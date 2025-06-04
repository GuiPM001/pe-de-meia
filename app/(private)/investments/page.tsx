"use client";

import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import Wrapper from "@/components/ui/wrapper";
import { getMonthNameByDate } from "@/core/utils/date";
import React, { useEffect, useState } from "react";

export default function Investments() {
  const [loading, setLoading] = useState<boolean>(false);
  const [yearSelected] = useState<number>(
    new Date().getFullYear()
  );

  const { months, getMonths } = useMonth();
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile._id) return;

    setLoading(true);

    getMonths(yearSelected, profile._id);

    setLoading(false);
  }, [yearSelected, profile._id]);

  return (
    <Wrapper>
      {loading && <div>OOOI</div>}

      <div className="grid grid-cols-4 gap-4 w-1/2 flex-wrap">
        {months.map((month) => (
          <div
            key={month.id}
            className="capitalize min-h-32 min-w-32 rounded-xl border border-gray-300 flex flex-col items-center py-4 relative"
          >
            <span>{getMonthNameByDate(month.id)}</span>
            <span className="m-auto">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(month.invested!)}
            </span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
