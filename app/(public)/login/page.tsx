"use client";

import React, { useState } from "react";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import Input from "@/components/core/input";
import PasswordInput from "@/components/core/passwordInput";
import Button from "@/components/core/button";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/core/types/LoginRequest";
import { ErrorResponse } from "@/core/types/ErrorResponse";
import { userService } from "@/core/services/user.service";
import { useProfile } from "@/app/context/ProfileContext";

export default function Login() {
  const router = useRouter();
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
      if (!form.email || !form.password) return;

      setLoading(true);

      const response = await userService.login(form);

      document.cookie = `authToken=${
        response.token
      }; path=/; max-age=${3600}; Secure; SameSite=Strict`;

      setProfile(response.user);
      router.replace("/");
    } catch (e: unknown) {
      setError(e as ErrorResponse);
      setLoading(false);
    }
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
            Bem-vindo de volta
          </h2>

          <form onKeyDown={handleKeyDown} className="space-y-6">
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              name="email"
              type="email"
              error={!!error}
              value={form.email}
              onChange={handleForm}
            />
            <PasswordInput
              label="Senha"
              placeholder="********"
              name="password"
              error={!!error}
              value={form.password}
              onChange={handleForm}
            />

            <Button
              type="submit"
              onClick={submitLogin}
              disabled={loading || !form.email || !form.password}
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
          {error && (
            <span className="text-red-600 text-sm">{error.message}</span>
          )}

          <p className="text-center text-gray-500 text-sm mt-2">
            Não tem uma conta?{" "}
            <a
              href="register"
              className="text-primary hover:underline font-semibold"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
