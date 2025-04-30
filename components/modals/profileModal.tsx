"use client";

import { useProfile } from "@/app/context/ProfileContext";
import { Profile } from "@/core/types/Profile";
import React, { useState } from "react";
import ModalActions from "./modalActions";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import Input from "../ui/input";
import CurrencyInput from "../ui/currencyInput";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { userService } from "@/core/services/user.service";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { profile, setProfile } = useProfile();

  const [form, setForm] = useState<Profile>(profile);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);

  const handleForm = (value: string | number, name: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSave = async () => {
    try {
      setLoading(true);

      await userService.update(form);
      setProfile(form);

      setLoading(false);
      onClose();
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <ModalContainer>
      <ModalTitle title="Perfil" onClose={onClose} />

      <div className="flex flex-col gap-6">
        <Input
          label="Nome"
          value={form.name}
          onChange={(e) => handleForm(e.target.value, "name")}
        />

        <Input label="E-mail" value={form.email} disabled />

        <CurrencyInput
          label="Meta de economia mensal"
          value={form.savingTarget}
          onChange={(e) => handleForm(e.target.value, "savingTarget")}
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
