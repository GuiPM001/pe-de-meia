"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { api } from "@/core/services/api";
import { Profile } from "@/core/types/Profile";

export default function Welcome() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    monthlySavingsGoal: "",
    dailySpending: "",
  });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!session?.user) return;

    try {
      // Assuming you have an API endpoint to create/update the user profile
      const profile: Profile = await api.post("/user", {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        ...form,
      });

      // Maybe do something with the profile, like setting it in a context
      
      router.replace("/");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center green-gradient p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-lg">
        <h2 className="text-3xl font-nunito font-bold text-gray-800 text-center mb-8">
          {t("welcome.title")}
        </h2>

        <div className="space-y-6">
          <Input
            label={t("welcome.monthlySavingsGoal")}
            placeholder="e.g., 500"
            name="monthlySavingsGoal"
            type="number"
            value={form.monthlySavingsGoal}
            onChange={handleForm}
          />

          <Input
            label={t("welcome.dailySpending")}
            placeholder="e.g., 50"
            name="dailySpending"
            type="number"
            value={form.dailySpending}
            onChange={handleForm}
          />

          <Button
            onClick={handleSubmit}
            disabled={!form.monthlySavingsGoal || !form.dailySpending}
            className="w-full py-3 text-lg mt-4"
          >
            {t("welcome.button")}
          </Button>
        </div>
      </div>
    </div>
  );
}