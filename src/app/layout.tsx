import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "SCA - Sistema Centralizador ADL",
  description: "Plataforma de gestão centralizada da ADL Group para automação de processos administrativos e operacionais.",
  keywords: ["ADL Group", "SCA", "sistema centralizador", "requisições", "gestão"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
