import React from "react";
import { INPUT_CLASSNAME } from "./constants";
import { InputProps } from "./input";
import { NumberFormatBase } from "react-number-format";
import Label from "./label";

interface CurrencyInputProps extends InputProps {
  onValueChange: (floatValue: number) => void;
}

const formatCurrency = (numericString: string) => {
  const digits = numericString.replace(/\D/g, "");
  const cents = digits === "" ? 0 : parseInt(digits, 10);

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
};

export default function CurrencyInput(props: CurrencyInputProps) {
  const valueInCents = Math.round(((props.value as number) ?? 0) * 100);

  return (
    <div className="w-full">
      <Label error={props.error} htmlFor={props.label}>
        {props.label}
      </Label>

      <div className="flex items-center">
        <span className="h-[40px] py-2 px-3 rounded-tl-md rounded-bl-md border border-r-0 border-gray-300 bg-gray-200 text-gray-500 uppercase">
          R$
        </span>

        <NumberFormatBase
          id={props.label}
          className={`${INPUT_CLASSNAME} rounded-l-none`}
          inputMode="numeric"
          type="text"
          value={valueInCents}
          valueIsNumericString={false}
          format={formatCurrency}
          removeFormatting={(formatted) => formatted.replace(/\D/g, "")}
          getCaretBoundary={(formatted) =>
            Array(formatted.length + 1).fill(false).fill(true, formatted.length)
          }
          onValueChange={(values) => {
            const cents = parseInt(values.value || "0", 10);
            props.onValueChange(cents / 100);
          }}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
}