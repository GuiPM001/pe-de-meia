import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "ghost";
  color?: "confirm" | "cancel";
}

export default function Button(props: ButtonProps) {
  const getColors = () => {
    if (props.color === "cancel")
      return "text-red-600 bg-red-600 hover:bg-red-600";

    return "text-white bg-gradient-primary hover:bg-primary-dark";
  };

  const getVariant = () => {
    if (props.variant === "ghost") return "bg-transparent";

    return "text-white";
  };

  return (
    <button
      {...props}
      className={`flex flex-row justify-center items-center gap-1 rounded-full py-1.5 px-3 text-center font-semibold transition hover:text-white cursor-pointer ${getColors()} ${getVariant()} disabled:bg-none disabled:bg-gray-200 disabled:cursor-default disabled:text-gray-400`}
    >
      {props.children}
    </button>
  );
}
