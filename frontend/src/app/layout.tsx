import type { Metadata } from "next";
import "./globals.css";


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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
