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

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setProfile } = useProfile();

  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
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

      const response: LoginResponse = await api.post("/auth/login", form);

      setProfile(response.user);
      router.replace("/");
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-hover p-4 relative overflow-hidden">


      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-lg relative z-10 border border-white/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-48 mb-6">
            <Image
              alt="Pé de meia logo"
              src={logo}
              width={384}
              height={188}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-gray-500 font-medium text-center text-sm sm:text-base">
            {t("slogan")}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-nunito font-bold text-gray-800 text-center mb-2">
            {t("login.title")}
          </h2>

          <form onKeyDown={handleKeyDown} className="space-y-5">
            <Input
              label={t("login.email")}
              placeholder={t("login.emailPlaceholder")}
              name="email"
              type="email"
              error={!!error}
              value={form.email}
              onChange={handleForm}
            />

            <PasswordInput
              label={t("login.password")}
              placeholder="********"
              name="password"
              error={!!error}
              value={form.password}
              onChange={handleForm}
            />

            <Button
              type="button"
              onClick={submitLogin}
              disabled={loading || !form.email || !form.password}
              className="w-full py-3 text-lg mt-4 shadow-lg shadow-green-200 hover:shadow-green-300"
            >
              {loading ? t("loading") : t("login.button")}
            </Button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error.message}
            </div>
          )}

          <div className="pt-4 text-center">
            <p className="text-gray-500 text-sm">
              {t("login.register")}{" "}
              <a
                href="register"
                className="text-primary hover:text-green-600 font-bold hover:underline"
              >
                {t("login.registerLink")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
