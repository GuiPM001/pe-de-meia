import React, { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <div
      className={`group/button relative flex items-center justify-center ${props.className}`}
    >
      <button
        {...props}
        className="rounded-full transition hover:scale-110 cursor-pointer "
      >
        {props.children}
      </button>

      {props?.label && (
        <div className="absolute whitespace-nowrap top-full left-1/2 z-20 mt-3 -translate-x-1/2 rounded bg-black py-2 px-4 text-sm text-white hidden group-hover/button:block">
          <span className="absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
          <p className="text-bottom">{props.label}</p>
        </div>
      )}
    </div>
  );
}
