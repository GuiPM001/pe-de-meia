"use client";

import React, { InputHTMLAttributes, useState } from "react";
import { TbEye } from "react-icons/tb";
import { TbEyeClosed } from "react-icons/tb";
import { INPUT_CLASSNAME } from "./constants";

export default function PasswordInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="w-full">
      <label className="font-medium mb-1" htmlFor="password">Senha</label>

      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className={INPUT_CLASSNAME}
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
