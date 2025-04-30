import React from "react";
import Button from "../core/button";

interface ModalActionsProps {
  onClose: () => void;
  onSave: () => void;
  saveDisabled: boolean;
}
export default function ModalActions({
  onClose,
  onSave,
  saveDisabled,
}: ModalActionsProps) {
  return (
    <div className="flex gap-6 w-full pt-6">
      <Button onClick={onClose} variant="ghost" color="cancel">
        Cancelar
      </Button>
      <Button onClick={onSave} disabled={saveDisabled}>
        Salvar
      </Button>
    </div>
  );
}
