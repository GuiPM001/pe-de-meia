"use client";

import React, { useEffect, useState } from "react";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import ProgressBar from "@/components/ui/progressBar";
import Wrapper from "@/components/ui/wrapper";
import YearSelect from "@/components/yearSelect";
import { getMonthNameByDate } from "@/core/utils/date";
import { getColors } from "@/core/utils/getColors";
import { currencyNumber } from "@/core/utils/numberFormat";
import "@/core/utils/date.extensions";
import { useTranslation } from "react-i18next";

export default function Investments() {
  const [loading, setLoading] = useState<boolean>(false);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [yearSelected, setYearSelected] = useState<number>(
    new Date().getFullYear()
  );

  const { months, getMonths } = useMonth();
  const { profile } = useProfile();
  const { t } = useTranslation();

  const actualDate = new Date().toISODateString();

  useEffect(() => {
    if (!profile._id) return;

    const fetchMonths = async () => {
      setLoading(true);
      await getMonths(yearSelected, profile._id);
      setLoading(false);
    };

    fetchMonths();
  }, [yearSelected, profile._id]);

  useEffect(() => {
    const totalInvested = months.reduce((acc, m) => m.invested! + acc, 0);
    setTotalInvested(totalInvested);
  }, [months]);

  return (
    <Wrapper>
      <div className=" w-[620px]">
        <YearSelect value={yearSelected} onChange={setYearSelected} />

        <ProgressBar
          value={totalInvested}
          minLabel={t('investments.total')}
          max={profile.savingTarget * 12}
          maxLabel={t('investments.goal')}
          loading={loading}
        />

        <div className="grid grid-cols-4 gap-2 flex-wrap">
          {months.map((month) => (
            <div
              key={month.id}
              className={`capitalize h-[100px] w-[148px] rounded-xl flex flex-col items-center py-4 relative
                          ${
                            month.id > actualDate
                              ? "bg-gray-200"
                              : getColors(month.invested!, 0, profile.savingTarget)
                          }`}
            >
              <span>{getMonthNameByDate(month.id)}</span>
              <span className="m-auto font-bold">
                {month.id <= actualDate ? currencyNumber(month.invested!) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
