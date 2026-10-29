"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { useTranslation } from "react-i18next";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { Profile } from "@/core/types/Profile";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Button from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currencyInput";
import Input from "@/components/ui/input";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const { t } = useTranslation();

  const [form, setForm] = useState<Profile>(profile);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    setForm(profile);
  }, [profile])

  const handleForm = (value: string | number, name: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSave = async () => {
    try {
      setLoading(true);

      await updateProfile(form);

      setLoading(false);
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          {t("profilePage.title")}
        </h1>
      </header>

      <div className="flex flex-col gap-6 mt-6">
        <Input
          label={t("profilePage.name")}
          value={form.name}
          onChange={(e) => handleForm(e.target.value, "name")}
        />

        <Input label={t("profilePage.email")} value={form.email} disabled />

        <CurrencyInput
          label={t("profilePage.savingTarget")}
          value={form.savingTarget}
          onValueChange={(floatValue) => handleForm(floatValue, "savingTarget")}
        />

        <CurrencyInput
          label={t("profilePage.dailyCost")}
          value={form.dailyCost}
          onValueChange={(floatValue) => handleForm(floatValue, "dailyCost")}
          disabled
        />
      </div>
      <div className="flex flex-col gap-3 mt-8">
        <Button
          onClick={onSave}
          disabled={!form.name || !form.savingTarget || loading}
        >
          {loading ? <LoadingSpinner /> : t("profilePage.save")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2 text-expense sm:flex-1"
        >
          <LogOut className="h-4 w-4" />
          {t("profilePage.logOut")}
        </Button>
      </div>
      {error && <span className="text-red-600 text-sm">{error.message}</span>}
    </>
  );
}
