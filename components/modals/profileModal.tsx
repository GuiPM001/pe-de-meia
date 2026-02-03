"use client";

import { useProfile } from "@/app/context/ProfileContext";
import { Profile } from "@/core/types/Profile";
import React, { useEffect, useState } from "react";
import ModalActions from "./modalActions";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import Input from "../ui/input";
import CurrencyInput from "../ui/currencyInput";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { useTranslation } from "react-i18next";

interface ProfileModalProps {
  onClose: () => void;
  open: boolean
}

export default function ProfileModal({ onClose, open }: ProfileModalProps) {
  const { profile, updateProfile } = useProfile();
  const { t } = useTranslation();

  const [form, setForm] = useState<Profile>(profile);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);

  const handleForm = (value: string | number, name: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  useEffect(() => {
    setForm(profile);
  }, [open])

  const onSave = async () => {
    try {
      setLoading(true);

      await updateProfile(form);
      
      setLoading(false);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <ModalTitle title={t('modal.profile.title')} onClose={onClose} />

      <div className="flex flex-col gap-6">
        <Input
          label={t('welcome.name')}
          value={form.name}
          onChange={(e) => handleForm(e.target.value, "name")}
        />

        <Input label={t('welcome.email')} value={form.email} disabled />

        <CurrencyInput
          label={t('welcome.savingTarget')}
          value={form.savingTarget}
          onValueChange={(floatValue) => handleForm(floatValue, "savingTarget")}
        />

        <CurrencyInput
          label={t('welcome.dailyCost')}
          value={form.dailyCost}
          onValueChange={(floatValue) => handleForm(floatValue, "dailyCost")}
          disabled
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          loading={loading}
          saveDisabled={!form.name || !form.savingTarget}
        />
      </div>
      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </ModalContainer>
  );
}
