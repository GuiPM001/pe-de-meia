"use client";

import React, { useState } from "react";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import Input from "../components/core/input";
import PasswordInput from "../components/core/passwordInput";
import Button from "../components/core/button";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitLogin = () => {
    console.log(form);
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

          <div className="space-y-6">
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              name="email"
              value={form.email}
              onChange={handleForm}
            />
            <PasswordInput
              placeholder="********"
              name="password"
              value={form.password}
              onChange={handleForm}
            />

            <Button type="submit" onClick={submitLogin}>
              Entrar
            </Button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-2">
            Não tem uma conta?{" "}
            <a href="#" className="text-primary hover:underline font-semibold">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
