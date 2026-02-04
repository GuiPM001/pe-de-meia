import React from "react";
import Image from "next/image";
import logo from "@/app/assets/logo-symbol.png";

export default function Logo() {
  return (
    <div className="flex flex-row items-center">
      <Image alt="Pé de meia logo" src={logo} width={28} />
      <span className="ml-1 font-extrabold text-xl/5 text-primary max-w-20">
        Pé de Meia
      </span>
    </div>
  );
}
