"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function ForceLogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return <div></div>;
}
