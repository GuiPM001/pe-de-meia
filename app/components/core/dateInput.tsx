"use client";

import React, { InputHTMLAttributes } from "react";
import { INPUT_CLASSNAME } from "./constants";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function DateInput(props: DateInputProps) {
  return (
    <div className="w-full">
      <label className="font-medium mb-1" htmlFor={props.label}>{props.label}</label>
      <input
        id={props.label}
        type="date"
        className={INPUT_CLASSNAME}
        {...props}
      />
    </div>
  );
}
