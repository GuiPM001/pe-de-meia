import React, { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <button
        {...props}
        className="rounded-full transition hover:scale-110 cursor-pointer "
      >
        {props.children}
      </button>

      {props?.label && (
        <span className="hidden group-hover:block absolute top-0 left-8 text-sm bg-gray-200 rounded-md py-1 px-2 text-gray-800 z-20">
          {props.label}
        </span>
      )}
    </div>
  );
}
