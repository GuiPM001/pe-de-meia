import React from "react";
import IconButton from "./ui/iconButton";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

interface YearSelectProps {
  value: number;
  onChange: (newYear: number) => void;
}
export default function YearSelect({ value, onChange }: YearSelectProps) {
  return (
    <div className="flex flex-row items-center gap-1 mb-2">
      <IconButton onClick={() => onChange(value - 1)}>
        <TbChevronLeft size="18px" />
      </IconButton>

      <span className="text-3xl font-black">{value}</span>

      <IconButton onClick={() => onChange(value + 1)}>
        <TbChevronRight size="18px" />
      </IconButton>
    </div>
  );
}
