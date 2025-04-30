import React from "react";
import IconButton from "../ui/iconButton";
import { TbX } from "react-icons/tb";

interface ModalTitleProps {
  title: string;
  onClose: () => void
}

export default function ModalTitle({ title, onClose }: ModalTitleProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-8">
      <h3 className="text-2xl font-bold">{title}</h3>

      <IconButton onClick={onClose}>
        <TbX size='24px'/>
      </IconButton>
    </div>
  );
}
