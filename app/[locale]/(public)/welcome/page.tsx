"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { api } from "@/core/services/api";
import { RegisterRequest } from "@/core/types/RegisterRequest";
import { TbHelp } from "react-icons/tb";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import Button from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currencyInput";
import Tooltip from "@/components/ui/tooltip";
import logo from "@/app/assets/logo.png";
import Image from "next/image";

type WelcomeForm = Pick<RegisterRequest, "dailyCost" | "savingTarget">;

export default function Welcome() {
  const { data: session, update } = useSession();
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<WelcomeForm>({
    savingTarget: undefined,
    dailyCost: undefined,
  });

  const handleForm = (name: string, value: number) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!session?.user || !session.user.email) return;

    try {
      setLoading(true);
      const request: RegisterRequest = {
        email: session.user.email,
        name: session.user.name ?? "",
        savingTarget: form.savingTarget,
        dailyCost: form.dailyCost,
      };

      const newUserId = await api.post("/user", request);

      await update({
        userId: newUserId,
        exists: true,
      });

      router.push("/");

      setLoading(false);
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center green-gradient p-4 relative overflow-hidden">
      <div className="bg-white backdrop-blur-xl rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-lg relative z-10 border border-white/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-48">
            <Image
              alt="Pé de meia logo"
              src={logo}
              width={384}
              height={188}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            {t("welcome.title")}
          </h2>

          <form onKeyDown={handleKeyDown} className="space-y-5">
            <CurrencyInput
              label={t("welcome.savingTarget")}
              value={form.savingTarget}
              onValueChange={(floatValue) =>
                handleForm("savingTarget", floatValue)
              }
            />

            <div className="relative">
              <CurrencyInput
                label={t("welcome.dailyCost")}
                value={form.dailyCost}
                onValueChange={(floatValue) =>
                  handleForm("dailyCost", floatValue)
                }
              />

              <div
                className="group absolute top-0 left-24 text-gray-400"
                tabIndex={0}
              >
                <TbHelp size="20px" />

                <Tooltip position="top" label={t("welcome.dailyCostHint")} />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              type="button"
              disabled={loading || !form.savingTarget || !form.dailyCost}
            >
              {loading ? t("loading") : t("welcome.button")}
            </Button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
