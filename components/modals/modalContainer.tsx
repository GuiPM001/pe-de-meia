import React from "react";

interface ModalContainerProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function ModalContainer({
  children,
  open,
  onClose,
}: ModalContainerProps) {
  if (!open) return <></>;

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed left-0 top-0 flex h-full min-h-screen bg-gray-800/75 w-full items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-11/12 max-w-[570px] rounded-xl p-6 lg:py-8 lg:px-10 bg-white overflow-y-auto max-h-10/12">
        {children}
      </div>
    </div>
  );
}
