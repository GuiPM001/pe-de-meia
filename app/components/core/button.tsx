import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "ghost";
  color?: "confirm" | "cancel";
}

export default function Button(props: ButtonProps) {
  const getColors = () => {
    if (props.color === "cancel")
      return "text-red-600 bg-red-600 hover:bg-red-600";

    return "text-[#1CA249] bg-[#1CA249] hover:bg-[#0C863C]";
  };

  const getVariant = () => {
    if (props.variant === "ghost") return "bg-transparent";

    return "text-white";
  };

  return (
    <button
      {...props}
      className={`w-1/2 rounded-md p-2 text-center font-semibold transition hover:text-white cursor-pointer ${getColors()} ${getVariant()} disabled:bg-gray-300 disabled:cursor-default`}
    >
      {props.children}
    </button>
  );
}
