import { ProfileProvider } from "./context/ProfileContext";
import "./globals.css";

export const metadata = {
  title: "Pé de Meia",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head></head>
      <body className="font-nunito">
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
