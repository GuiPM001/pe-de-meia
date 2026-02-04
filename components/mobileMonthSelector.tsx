import { useMonth } from "@/app/context/MonthContext";
import { Month } from "@/core/types/Month";
import { getMonthNameByDate } from "@/core/utils/date";
import { getColors } from "@/core/utils/getColors";
import React, { useEffect, useState } from "react";
import { TbCalendar, TbChevronRight } from "react-icons/tb";
import MonthsModal from "./modals/monthsModal";
import LoadingSpinner from "./ui/loadingSpinner";

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
  const [status, setStatus] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { monthSelected } = useMonth();

  useEffect(() => {
    if (!monthSelected.balance) {
      if (loading) return;

      setStatus("Sem dados");
      return;
    }

    if (monthSelected.balance >= savingTarget) {
      setStatus("Acima da meta");
      return;
    }

    if (monthSelected.balance + (monthSelected.invested ?? 0) >= savingTarget) {
      setStatus("Acima da meta somando o total investido");
      return;
    }

    if (
      monthSelected.balance <= 0 ||
      Number(monthSelected.balance.toFixed(2)) <= 0
    ) {
      setStatus("Saldo negativo");
      return;
    }

    setStatus("Abaixo da meta");
  }, [monthSelected.balance, savingTarget]);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className={`lg:hidden flex flex-row items-center justify-between w-full rounded-lg px-4 py-2 mt-8 cursor-pointer 
        ${loading ? "bg-gray-100 text-gray-500" : getColors(month.balance, month.invested ?? 0, savingTarget)} ring-1`}
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
