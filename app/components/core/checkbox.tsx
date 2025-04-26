"use client";

import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox(props: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);

    if (props.onChange) props.onChange(e);
  };
  return (
    <label className="flex items-center cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className="mr-2 flex h-[20px] w-[20px] items-center justify-center rounded-md border border-gray-400">
          <span
            className={`h-[15px] w-[15px] rounded-sm ${
              isChecked ? "bg-[#1EA44D]" : "bg-transparent"
            }`}
          ></span>
        </div>
      </div>
      {props.label}
    </label>
  );
}
