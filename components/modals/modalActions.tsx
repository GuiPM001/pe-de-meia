import React from "react";
import Button from "../ui/button";

interface ModalActionsProps {
  onClose: () => void;
  onSave: () => void;
  saveDisabled: boolean;
  labelSaveButton?: string;
  loading?: boolean;
}
export default function ModalActions({
  onClose,
  onSave,
  saveDisabled,
  loading,
  labelSaveButton,
}: ModalActionsProps) {
  return (
    <div className="flex gap-6 w-full pt-6">
      <Button
        onClick={onClose}
        variant="ghost"
        color="cancel"
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button onClick={onSave} disabled={saveDisabled || loading}>
        {labelSaveButton ?? "Salvar"}
      </Button>
    </div>
  );
}
