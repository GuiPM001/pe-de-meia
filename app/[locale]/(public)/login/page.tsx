"use client";

import React, { useState } from "react";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import Input from "@/components/ui/input";
import PasswordInput from "@/components/ui/passwordInput";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/core/types/LoginRequest";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { useProfile } from "@/app/context/ProfileContext";
import { api } from "@/core/services/api";
import { LoginResponse } from "@/core/types/LoginResponse";
import { useTranslation } from "react-i18next";
import Checkbox from "@/components/ui/checkbox";

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setProfile } = useProfile();

  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitLogin();
    }
  };

  const submitLogin = async () => {
    try {
      setLoading(true);

      const response: LoginResponse = await api.post("/user/login", form);

      document.cookie = `authToken=${response.token}; path=/; max-age=${
        form.rememberMe ? 160000000 : ""
      }; Secure; SameSite=Strict`;

      setProfile(response.user);
      router.replace("/");
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-green-100 to-primary">
  {/* Seção da logo */}
  <div className="flex flex-col items-center justify-center p-8 bg-white lg:w-1/2">
    <Image alt="Pé de meia logo" src={logo} width={384} height={188} />
    <p className="text-gray-600 mt-4 max-w-xs text-center">
      {t("slogan")}
    </p>
  </div>

  {/* Seção do formulário */}
  <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
    <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
      <h2 className="text-2xl font-bold text-primary-dark text-center mb-8">
        {t("login.title")}
      </h2>

      <form onKeyDown={handleKeyDown} className="space-y-6">
        <Input
          label={t("login.email")}
          placeholder={t("login.emailPlaceholder")}
          name="email"
          type="email"
          error={!!error}
          value={form.email}
          onChange={handleForm}
        />

        <div className="flex flex-col gap-3">
          <PasswordInput
            label={t("login.password")}
            placeholder="********"
            name="password"
            error={!!error}
            value={form.password}
            onChange={handleForm}
          />

          <Checkbox
            label={t("login.rememberMe")}
            checked={form.rememberMe}
            onChange={(e) =>
              setForm({ ...form, rememberMe: e.target.checked })
            }
          />
        </div>

        <Button
          type="button"
          onClick={submitLogin}
          disabled={loading || !form.email || !form.password}
          className="w-full"
        >
          {loading ? t("loading") : t("login.button")}
        </Button>
      </form>

      {error && (
        <span className="text-red-600 text-sm">{error.message}</span>
      )}

      <p className="text-center text-gray-500 text-sm mt-4">
        {t("login.register")}{" "}
        <a
          href="register"
          className="text-primary hover:underline font-semibold"
        >
          {t("login.registerLink")}
        </a>
      </p>
    </div>
  </div>
</div>
  );
}
