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

export default function Register() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    savingTarget: 0,
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
        setError({ message: "A senha deve ter pelo menos 8 caracteres." });
        return;
      }

      if (!isValidEmail(form.email)) {
        setError({ message: "E-mail informado é inválido." });
        return;
      }

      await api.post("/user/register", form);

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
    <div className="flex h-screen bg-gradient-to-br from-green-100 to-primary">
      <div className="flex flex-col w-1/2 bg-white items-center justify-center p-8">
        <Image alt="Pé de meia logo" src={logo} width={384} height={188} />
        <p className="text-gray-600 mt-4 max-w-72 text-wrap text-center">
          Enxergue seu futuro financeiro com clareza e segurança.
        </p>
      </div>

      <div className="flex w-1/2 items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-primary-dark text-center mb-8">
            Criar uma conta
          </h2>

          <form onKeyDown={handleKeyDown} className="space-y-6">
            <Input
              label="Nome"
              placeholder="Seu nome"
              name="name"
              value={form.name}
              onChange={handleForm}
            />
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              name="email"
              value={form.email}
              onChange={handleForm}
            />
            <PasswordInput
              label="Senha"
              placeholder="********"
              name="password"
              value={form.password}
              onChange={handleForm}
            />
            <CurrencyInput
              label="Meta de economia mensal"
              name="savingTarget"
              value={form.savingTarget}
              onChange={handleForm}
            />

            <Button
              type="button"
              onClick={submitRegister}
              disabled={loading || !form.name || !form.email || !form.password}
            >
              {loading ? "Carregando..." : "Cadastrar"}
            </Button>
          </form>
          {error && (
            <span className="text-red-600 text-sm">{error.message}</span>
          )}

          <p className="text-center text-gray-500 text-sm mt-2">
            Já possui conta?{" "}
            <a
              href="login"
              className="text-primary hover:underline font-semibold"
            >
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
