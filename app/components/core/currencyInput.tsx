import React, { InputHTMLAttributes } from "react";
import { INPUT_CLASSNAME } from "./constants";

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <div className="w-full">
      <label className="font-medium mb-1" htmlFor={props.label}>{props.label}</label>
      <div className="flex items-center">
        <span className="h-[40px] py-2 px-3 rounded-tl-md rounded-bl-md border border-r-0 border-gray-300 bg-gray-200 text-gray-500 uppercase">
          R$
        </span>
        <input
          type="number"
          id={props.label}
          className={`${INPUT_CLASSNAME} rounded-l-none`}
          {...props}
        />
      </div>
    </div>
  );
}
