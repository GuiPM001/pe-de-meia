import React, { InputHTMLAttributes } from "react";
import { INPUT_CLASSNAME } from "./constants";
import Label from "./label";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

export default function Input(props: InputProps) {
  return (
    <div className="w-full relative">
      <Label error={props.error} htmlFor={props.label}>
        {props.label}
      </Label>

      <input
        id={props.label}
        className={`
          ${INPUT_CLASSNAME} 
          ${props.error ? "border-red-600" : ""}
        `}
        {...props}
      />
    </div>
  );
}
