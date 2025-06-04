import { MonthProvider } from "./context/MonthContext";
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
        <ProfileProvider>
          <MonthProvider>{children}</MonthProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}

// TODO adicionar nova tela com o total de investimentos (seprados por mês)
// TODO não deixar eidtar o mês - edição transação
