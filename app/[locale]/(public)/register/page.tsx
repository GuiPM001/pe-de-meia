"use client";

import React, { useState } from "react";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import Input from "@/components/ui/input";
import PasswordInput from "@/components/ui/passwordInput";
import Button from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currencyInput";
import { RegisterRequest } from "@/core/types/RegisterRequest";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { api } from "@/core/services/api";
import { useTranslation } from "react-i18next";

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    savingTarget: 0,
    dailyCost: 0
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
      submitRegister();
    }
  };

  const submitRegister = async () => {
    try {
      setLoading(true);

      if (form.password.length < 8) {
        setError({ message: t('register.error.password') });
        return;
      }

      if (!isValidEmail(form.email)) {
        setError({ message: t('register.error.email') });
        return;
      }

      await api.post("/auth/register", form);

      router.replace("/login");
    } catch (e: unknown) {
      setError(e as ErrorResponse);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            {t('slogan')}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-nunito font-bold text-gray-800 text-center mb-2">
            {t('register.title')}
          </h2>

          <form onKeyDown={handleKeyDown} className="space-y-5">
            <Input
              label={t('register.name')}
              placeholder={t('register.namePlaceholder')}
              name="name"
              value={form.name}
              onChange={handleForm}
            />
            <Input
              label={t('register.email')}
              placeholder={t('register.emailPlaceholder')}
              name="email"
              value={form.email}
              onChange={handleForm}
            />
            <PasswordInput
              label={t('register.password')}
              placeholder="********"
              name="password"
              value={form.password}
              onChange={handleForm}
            />
            <CurrencyInput
              label={t('register.savingTarget')}
              name="savingTarget"
              value={form.savingTarget}
              onValueChange={(floatValue) =>
                setForm({
                  ...form,
                  savingTarget: floatValue,
                })
              }
            />
            <CurrencyInput
              label={t('register.dailyCost')}
              name="dailyCost"
              value={form.dailyCost}
              onValueChange={(floatValue) =>
                setForm({
                  ...form,
                  dailyCost: floatValue,
                })
              }
            />

            <Button
              type="button"
              onClick={submitRegister}
              disabled={loading || !form.name || !form.email || !form.password}
              className="w-full py-3 text-lg mt-4 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all"
            >
              {loading ? t('loading') : t('register.button')}
            </Button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error.message}
            </div>
          )}

          <div className="pt-4 text-center">
            <p className="text-gray-500 text-sm">
              {t('register.login')}
              <a
                href="login"
                className="text-primary hover:text-green-600 font-bold hover:underline transition-colors"
              >
                {t('register.loginLink')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
