import { useMonth } from "@/app/context/MonthContext";
import { Month } from "@/core/types/Month";
import { getMonthNameByDate } from "@/core/utils/date";
import { getColors } from "@/core/utils/getColors";
import React, { useEffect, useState } from "react";
import { TbCalendar, TbChevronRight } from "react-icons/tb";
import MonthsModal from "./modals/monthsModal";
import LoadingSpinner from "./ui/loadingSpinner";
import { useTranslation } from "react-i18next";

interface MobileMonthSelectorProps {
  month: Month;
  year: number;
  savingTarget: number;
  handleChangeYear: (newYear: number) => void;
  loading: boolean;
}

export default function MobileMonthSelector({
  month,
  year,
  savingTarget,
  handleChangeYear,
  loading,
}: MobileMonthSelectorProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { monthSelected } = useMonth();
  const { t } = useTranslation();

  useEffect(() => {
    if (loading || monthSelected.balance === null) {
      setStatus(null);
      return;
    }

    if (monthSelected.balance >= savingTarget) {
      setStatus(t("monthStatus.green"));
      return;
    }

    if (monthSelected.balance + (monthSelected.invested ?? 0) >= savingTarget) {
      setStatus(t("monthStatus.greenWithInvestment"));
      return;
    }

    if (Number(monthSelected.balance.toFixed(2)) <= 0) {
      setStatus(t("monthStatus.red"));
      return;
    }

    setStatus(t("monthStatus.yellow"));
  }, [monthSelected, savingTarget, loading, t]);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className={`lg:hidden flex flex-row items-center justify-between w-full rounded-lg px-4 py-2 mt-8 cursor-pointer 
        ${loading || !status ? "bg-white text-gray-500" : getColors(month.balance, month.invested ?? 0, savingTarget)} ring-1`}
      >
        <div className="flex flex-row gap-2 items-center">
          <TbCalendar size={"22px"} />

          <div className="flex flex-col justify-start items-start">
            <span className="capitalize text-black font-semibold">
              {getMonthNameByDate(month?.id)} {year}
            </span>

            <span className="text-xs">{status}</span>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : <TbChevronRight size={"22px"} />}
      </button>

      {modalOpen && (
        <MonthsModal
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          yearSelected={year}
          handleChangeYear={handleChangeYear}
          loading={loading}
        />
      )}
    </>
  );
}
