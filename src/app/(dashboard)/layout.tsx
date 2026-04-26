import { AppShell } from "@/components/layout/app-shell";
import type { ReactNode } from "react";
import { getLang } from "@/i18n/server";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const lang = getLang();
  return <AppShell lang={lang}>{children}</AppShell>;
}
