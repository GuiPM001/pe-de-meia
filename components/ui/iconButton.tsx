import React, { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center rounded-full transition cursor-pointer ${props.className}`}
    >
      {props.children}
    </button>
  );
}
