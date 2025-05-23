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

// TODO editar uma transação (não permitir editar recorrência)
// TODO editar saída diária -> escolher qual editar antes

// TODO alterar endpoint delete

// TODO incluir novo tipo de transação -> investimento
// TODO adicionar nova tela com o total de investimentos (seprados por mês)