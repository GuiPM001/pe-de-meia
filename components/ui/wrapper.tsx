import React from "react";
import NavBar from "../navbar";

export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen flex flex-col overflow-x-hidden">
      <NavBar />
      <div className="p-2">{children}</div>
    </div>
  );
}
