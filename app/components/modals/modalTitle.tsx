import React from "react";

interface ModalTitleProps {
  title: string;
}

export default function ModalTitle({ title }: ModalTitleProps) {
  return <h3 className="text-2xl font-bold mb-8">{title}</h3>;
}
