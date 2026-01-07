import "../globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ServerProviders } from "../providers/ServerProviders";

export const metadata: Metadata = {
  title: "Pé de Meia",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ServerProviders>{children}</ServerProviders>
      </body>
    </html>
  );
}
