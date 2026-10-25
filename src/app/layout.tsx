import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { SessionProvider } from "@/lib/session";

export const metadata: Metadata = {
  title: "Isora · Aprende alemán",
  description: "Aprende alemán del A1 al B1 con videos, explicaciones claras, lecturas y ejercicios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full">
      <body className="paper-grain min-h-full">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
