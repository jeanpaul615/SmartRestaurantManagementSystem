import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";


export const metadata: Metadata = {
  title: "Smart Restaurant",
  description: "Sistema de gestión inteligente para restaurantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
