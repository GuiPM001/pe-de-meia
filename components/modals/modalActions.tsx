import React from "react";
import Button from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-6 w-full pt-6">
      <Button
        onClick={onClose}
        variant="ghost"
        color="cancel"
        disabled={loading}
      >
        {t('modal.actions.cancel')}
      </Button>
      <Button onClick={onSave} disabled={saveDisabled || loading}>
        {loading ? <LoadingSpinner /> : labelSaveButton ?? t('modal.actions.save')}
      </Button>
    </div>
  );
}
