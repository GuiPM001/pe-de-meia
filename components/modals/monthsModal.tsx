import React, { useEffect } from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { getMonthNameByDate } from "@/core/utils/date";
import { currencyNumber } from "@/core/utils/numberFormat";
import { getColors } from "@/core/utils/getColors";
import { Month } from "@/core/types/Month";

interface MonthsModalProps {
  onClose: () => void;
  open: boolean;
  yearSelected: number;
  actualMonth: Month;
  setMonth: (month: Month) => void;
  setMonthSelected: (month: number) => void;
}

export default function MonthsModal({
  onClose,
  open,
  yearSelected,
  actualMonth,
  setMonth,
  setMonthSelected
}: MonthsModalProps) {
  const { months, getMonths } = useMonth();
  const { profile } = useProfile();

  useEffect(() => {
    getMonths(yearSelected, profile._id);
  }, [yearSelected]);

  const selectMonth = (month: Month) => {
    setMonthSelected(new Date(month.id).getUTCMonth())
    setMonth(month);
    onClose();
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalTitle title={yearSelected.toString()} onClose={onClose} />

      <div className="grid grid-cols-3 gap-4 ">
        {months.map((month) => (
          <button
            onClick={() => selectMonth(month)}
            key={month.id}
            className={`relative flex flex-col items-center p-6 rounded-lg ${
              month.balance
                ? getColors(
                    month.balance!,
                    month.invested!,
                    profile.savingTarget,
                    actualMonth.id === month.id
                  )
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <span className="absolute top-2 left-2 text-sm capitalize opacity-75">
              {getMonthNameByDate(month.id)}
            </span>

            <span className="font-bold mt-4">
              {month.balance ? currencyNumber(month.balance) : "-"}
            </span>
          </button>
        ))}
      </div>
    </ModalContainer>
  );
}
