import React, { InputHTMLAttributes } from "react";

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <div className="w-full">
      <label className="font-medium mb-1">{props.label}</label>
      <div className="flex items-center">
        <span className="h-[40px] py-2 px-3 rounded-tl-md rounded-bl-md border border-r-0 border-gray-300 bg-gray-200 text-gray-500 uppercase">
          R$
        </span>
        <input
          type="text"
          className="h-[40px] py-2 px-3 w-full bg-transparent rounded-tr-md rounded-br-md border border-gray-300 outline-none transition focus:border-[#1EA44D] active:border-[#1EA44D"
          {...props}
        />
      </div>
    </div>
  );
}
