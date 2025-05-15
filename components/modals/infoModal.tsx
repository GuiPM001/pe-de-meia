import React from "react";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

interface InfoModalProps {
  onClose: () => void;
  open: boolean;
}

export default function InfoModal({ onClose, open }: InfoModalProps) {
  return (
    <ModalContainer open={open}>
      <ModalTitle title="Info" onClose={onClose} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-green-text"></div>
            <span>Saldo acima da meta estipulada</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-red-text"></div>
            <span>Saldo negativo</span>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="h-5 w-5 rounded-md bg-yellow-text"></div>
            <span>Saldo abaixo da meta estipulada</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center">
            <TbCaretUpFilled className="text-green-text" size="24px" />
            <span>Entrada</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <TbCaretDownFilled className="text-red-text" size="24px" />
            <span>Saída</span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <TbCaretDownFilled className="text-yellow-text" size="24px" />
            <span>Gasto diário</span>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
