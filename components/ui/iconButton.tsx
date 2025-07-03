import React, { ButtonHTMLAttributes } from "react";
import Tooltip from "./tooltip";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <div
      className={`group relative flex items-center justify-center ${props.className}`}
    >
      <button
        {...props}
        className="rounded-full transition hover:scale-110 cursor-pointer "
      >
        {props.children}
      </button>

      {props?.label && (
        <Tooltip position="bottom" label={props.label} />
      )}
    </div>
  );
}
