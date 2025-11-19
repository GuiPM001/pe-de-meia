import React from "react";
import { INPUT_CLASSNAME } from "./constants";
import { InputProps } from "./input";
import { NumericFormat } from "react-number-format";
import Label from "./label";

interface CurrencyInputProps extends InputProps {
  onValueChange: (floatValue: number) => void;
}

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <div className="w-full">
      <Label error={props.error} htmlFor={props.label}>
        {props.label}
      </Label>

      <div className="flex items-center">
        <span className="h-[40px] py-2 px-3 rounded-tl-md rounded-bl-md border border-r-0 border-gray-300 bg-gray-200 text-gray-500 uppercase">
          R$
        </span>

        <NumericFormat
          id={props.label}
          className={`${INPUT_CLASSNAME} rounded-l-none`}
          inputMode="decimal"
          type="text"
          decimalScale={2}
          fixedDecimalScale={true}
          decimalSeparator=","
          thousandSeparator="."
          allowNegative={false}
          value={props.value as number}
          onValueChange={(values) => props.onValueChange(values.floatValue ?? 0)}
        />
      </div>
    </div>
  );
}
