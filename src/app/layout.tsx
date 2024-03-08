import './global.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify API JCM",
  description: "Usando la API de spofity para obtener musica",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="es">
      <body className={`m-0	${inter.className}`}>{children}</body>
    </html>
  );
}
