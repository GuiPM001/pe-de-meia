import React from "react";
import ModalContainer from "./modalContainer";
import { useMonth } from "@/app/context/MonthContext";
import { useProfile } from "@/app/context/ProfileContext";
import { Month } from "@/core/types/Month";
import { TbX } from "react-icons/tb";
import YearSelect from "../yearSelect";
import IconButton from "../ui/iconButton";
import MonthButton from "../monthButton";
import LoadingSpinner from "../ui/loadingSpinner";

interface MonthsModalProps {
  onClose: () => void;
  open: boolean;
  yearSelected: number;
  handleChangeYear: (year: number) => void;
  loading: boolean;
}

export default function MonthsModal({
  onClose,
  open,
  yearSelected,
  handleChangeYear,
  loading,
}: MonthsModalProps) {
  const { months, monthSelected, selectMonth, createMonth, monthLoading } =
    useMonth();
  const { profile } = useProfile();

  const handleClick = (month: Month) => {
    selectMonth(month);
    onClose();
  };

  const handleCreateMonth = async (idMonth: string) => {
    await createMonth(idMonth, profile._id, yearSelected);
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <div className="flex flex-row justify-between items-center mb-8">
        <YearSelect value={yearSelected} onChange={handleChangeYear} />

        <IconButton onClick={onClose}>
          <TbX size="24px" />
        </IconButton>
      </div>

      <div className="grid grid-cols-3 gap-2 min-h-60">
        {loading ? (
          <div className="flex justify-center items-center col-span-3">
            <LoadingSpinner />
          </div>
        ) : (
          months.map((month) => (
            <MonthButton
              key={month.id}
              month={month}
              selected={monthSelected.id === month.id}
              savingTarget={profile.savingTarget}
              addMonth={handleCreateMonth}
              monthLoading={monthLoading}
              setMonth={handleClick}
            />
          ))
        )}
      </div>
    </ModalContainer>
  );
}
