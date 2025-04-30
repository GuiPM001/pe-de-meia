import React, { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  error?: boolean;
}
export default function Label(props: LabelProps) {
  return (
    <label
      className={`
        'font-medium mb-1'
        ${props.error ? "text-red-600" : ""}
      `}
      {...props}
    >
      {props.children}
    </label>
  );
}
