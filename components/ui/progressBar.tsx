import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-md h-[6px] mt-0.5 mb-4">
      <div
        className="bg-primary h-[6px] transition-all duration-500 ease-in-out rounded-md"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
