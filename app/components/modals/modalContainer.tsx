import React from "react";

interface ModalContainerProps {
  children: React.ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen bg-gray-800/75 w-full items-center justify-center">
      <div className="w-full max-w-[570px] rounded-xl py-8 px-10 bg-white">
        {children}
      </div>
    </div>
  );
}
