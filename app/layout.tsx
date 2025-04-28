import { ProfileProvider } from "./context/ProfileContext";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="font-nunito">
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
