import "../globals.css";
import type { Metadata } from "next";
import { Providers } from "../Providers";
import { ReactNode } from "react";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
