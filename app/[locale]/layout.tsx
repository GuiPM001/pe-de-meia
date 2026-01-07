import "../globals.css";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { ServerProviders } from "../providers/ServerProviders";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Pé de Meia",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-nunito">
        <Suspense fallback={<Loading />}>
          <ServerProviders>{children}</ServerProviders>
        </Suspense>
      </body>
    </html>
  );
}
