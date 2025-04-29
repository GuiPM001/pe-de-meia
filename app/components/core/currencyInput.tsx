import React from "react";
import { INPUT_CLASSNAME } from "./constants";
import { InputProps } from "./input";
import Label from "./label";

export default function CurrencyInput(props: InputProps) {
  return (
    <div className="w-full">
      <Label error={props.error} htmlFor={props.label}>
        {props.label}
      </Label>
      
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
