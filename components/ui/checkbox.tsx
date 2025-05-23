import React, { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <label
      className={`flex items-center select-none ${
        props.disabled ? "text-gray-400 cursor-default" : "cursor-pointer"
      }`}
    >
      <div className="relative">
        <input type="checkbox" className="sr-only" {...props} />
        <div className="mr-2 flex h-[20px] w-[20px] items-center justify-center rounded-md border border-gray-400">
          <span
            className={`h-[15px] w-[15px] rounded-sm ${
              props.checked ? "bg-primary" : "bg-transparent"
            }`}
          ></span>
        </div>
      </div>
      {props.label}
    </label>
  );
}
