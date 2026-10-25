import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { SessionProvider } from "@/lib/session";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${APP_NAME} · Aprende alemán`,
  description: "Aprende alemán del A1 al B1 con videos, explicaciones claras, lecturas y ejercicios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full">
      <body className="paper-grain min-h-full">
        <SessionProvider>{children}</SessionProvider>
        {/* Si el navegador no logra arrancar la app (muy antiguo o app interna), mostramos un aviso en vez del spinner eterno */}
        <script
          dangerouslySetInnerHTML={{
            __html: `setTimeout(function(){if(window.__isoraReady)return;var d=document.createElement('div');d.setAttribute('style','position:fixed;inset:0;z-index:99;display:flex;align-items:center;justify-content:center;padding:24px;background:#f5f1e8;font-family:sans-serif;text-align:center;color:#2e2019');d.innerHTML='<div style="max-width:320px"><p style="font-size:20px;color:#940d00;margin:0 0 8px">Isora no pudo cargar</p><p style="font-size:14px;line-height:1.5;margin:0 0 16px">Abre este enlace en Chrome o Safari y asegúrate de tener el navegador actualizado.</p><a href="" style="display:inline-block;background:#940d00;color:#fff;border-radius:999px;padding:10px 20px;text-decoration:none">Recargar</a></div>';document.body.appendChild(d)},15000);`,
          }}
        />
      </body>
    </html>
  );
}
