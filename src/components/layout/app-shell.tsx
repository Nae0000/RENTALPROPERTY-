import Link from "next/link";
import { Bell, Calendar, Home, LayoutDashboard, Receipt, Users } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

const navItems = [
  { href: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/rooms", key: "nav.rooms", icon: Home },
  { href: "/tenants", key: "nav.tenants", icon: Users },
  { href: "/income", key: "nav.income", icon: Receipt },
  { href: "/expenses", key: "nav.expenses", icon: Receipt },
  { href: "/calendar", key: "nav.calendar", icon: Calendar },
  { href: "/reports", key: "nav.reports", icon: Bell }
];

export function AppShell({ children, lang }: { children: ReactNode; lang: Lang }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <h1 className="mb-6 text-lg font-semibold">{t(lang, "brand.name")}</h1>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {t(lang, item.key)}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-4">
          <header className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
            <input
              placeholder={t(lang, "topbar.searchPlaceholder")}
              className="w-full max-w-md rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">{t(lang, "topbar.premium")}</div>
              <LanguageSwitcher lang={lang} />
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
