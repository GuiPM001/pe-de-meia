import React from "react";
import TabBar from "@/components/tabBar";

export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen flex flex-col overflow-x-hidden bg-gray-100">
      <TabBar />
      <div className="px-4 pt-6 pb-28 max-w-md">{children}</div>
    </div>
  );
}
