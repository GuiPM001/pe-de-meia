"use client";

import React, { useState } from "react";
import { TbEye } from "react-icons/tb";
import { TbEyeClosed } from "react-icons/tb";
import { INPUT_CLASSNAME } from "./constants";
import { InputProps } from "./input";
import Label from "./label";

export default function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="w-full">
      <Label error={props.error} htmlFor={props.label}>
        {props.label}
      </Label>

      <div className="relative">
        <input
          id={props.label}
          type={showPassword ? "text" : "password"}
          className={`
                    ${INPUT_CLASSNAME} 
                    ${props.error ? "border-red-600" : ""}
                  `}
          {...props}
        />

        <button
          className="absolute right-3 top-0 bottom-0 "
          onClick={togglePassword}
        >
          {showPassword ? <TbEye /> : <TbEyeClosed />}
        </button>
      </div>
    </div>
  );
}
