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
import { api } from "@/core/services/api";
import { useTranslation } from "react-i18next";

interface ProfileModalProps {
  onClose: () => void;
  open: boolean
}

export default function ProfileModal({ onClose, open }: ProfileModalProps) {
  const { profile, setProfile } = useProfile();
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

      await api.put("/user/update", form);
      setProfile(form);

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
          label={t('register.name')}
          value={form.name}
          onChange={(e) => handleForm(e.target.value, "name")}
        />

        <Input label={t('register.email')} value={form.email} disabled />

        <CurrencyInput
          label={t('register.savingTarget')}
          value={form.savingTarget}
          onValueChange={(floatValue) => handleForm(floatValue, "savingTarget")}
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
