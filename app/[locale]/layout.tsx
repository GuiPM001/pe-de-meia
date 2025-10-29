import "../globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ServerProviders } from "../providers/ServerProviders";

export const metadata: Metadata = {
  title: "Pé de Meia",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="font-nunito">
        <ServerProviders>{children}</ServerProviders>
      </body>
    </html>
  );
}
