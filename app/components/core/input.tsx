import React, { InputHTMLAttributes } from "react";
import { INPUT_CLASSNAME } from "./constants";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input(props: InputProps) {
  return (
    <div className="w-full">
      <label className="font-medium mb-1" htmlFor={props.label}>{props.label}</label>
      <input
        type="text"
        id={props.label}
        className={INPUT_CLASSNAME}
        {...props}
      />
    </div>
  );
}
