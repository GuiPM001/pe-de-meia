import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input(props: InputProps) {
  return (
    <div className="w-full">
      <label className="font-medium mb-1">{props.label}</label>
      <input
        type="text"
        className="w-full bg-transparent rounded-md border border-gray-300 h-[40px] py-2 px-3 outline-none transition focus:border-primary active:border-primary"
        {...props}
      />
    </div>
  );
}
