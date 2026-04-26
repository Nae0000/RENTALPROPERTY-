import "./globals.css";
import type { ReactNode } from "react";
import { getLang } from "@/i18n/server";

export const metadata = {
  title: "Rental Property Management",
  description: "Premium dashboard for rental property operations."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const lang = getLang();
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
