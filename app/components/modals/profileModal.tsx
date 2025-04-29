"use client";

import { useProfile } from "@/app/context/ProfileContext";
import { Profile } from "@/app/types/Profile";
import React, { useState } from "react";
import ModalActions from "./modalActions";
import ModalContainer from "./modalContainer";
import ModalTitle from "./modalTitle";
import Input from "../core/input";
import CurrencyInput from "../core/currencyInput";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { profile, setProfile } = useProfile();

  const [form, setForm] = useState<Profile>(profile);

  const handleForm = (value: string | number, name: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSave = () => {
    setProfile(form);
    onClose();
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
          saveDisabled={!form.name || !form.savingTarget}
        />
      </div>
    </ModalContainer>
  );
}
