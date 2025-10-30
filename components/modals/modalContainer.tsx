import React from "react";

interface ModalContainerProps {
  children: React.ReactNode;
  open: boolean;
}

export default function ModalContainer({
  children,
  open,
}: ModalContainerProps) {
  if (!open) return <></>;

  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen bg-gray-800/75 w-full items-center justify-center z-20">
      <div className="w-11/12 max-w-[570px] rounded-xl p-6 lg:py-8 lg:px-10 bg-white">
        {children}
      </div>
    </div>
  );
}
