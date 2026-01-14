"use client";

import React, { useEffect, useState } from "react";
import logo from "@/app/assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

import { handleSignIn } from "@/lib/auth";
import { TbBrandGoogleFilled } from "react-icons/tb";
import Button from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session?.user || status !== "authenticated") return;

    const user = session.user as { exists?: boolean };

    if (user.exists === false) {
      router.push("/welcome");
    } else {
      router.push("/");
    }
  }, [status, session, router]);

  const signIn = () => {
    setLoading(true);
    handleSignIn();
  }

  return (
    <div className="min-h-screen flex items-center justify-center green-gradient p-4 relative overflow-hidden">
      <div className="bg-white backdrop-blur-xl rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-lg relative z-10 border border-white/50">
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

        <div className="space-y-6 flex flex-col justify-center items-center gap-6">
          <h2 className="text-3xl font-nunito font-bold text-gray-800 mb-2">
            {t("login.title")}
          </h2>

          <Button
            onClick={signIn}
            disabled={loading}
          >
            <TbBrandGoogleFilled size='20px' />
            {loading ? t("loading") : t("login.button")}
          </Button>
        </div>
      </div>
    </div>
  );
}
