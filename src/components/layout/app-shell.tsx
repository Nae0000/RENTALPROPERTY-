import Link from "next/link";
import { Bell, Calendar, Home, LayoutDashboard, Receipt, Users } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rooms", label: "Rooms", icon: Home },
  { href: "/tenants", label: "Tenants", icon: Users },
  { href: "/income", label: "Income", icon: Receipt },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reports", label: "Reports", icon: Bell }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <h1 className="mb-6 text-lg font-semibold">Rental Property</h1>
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-4">
          <header className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
            <input
              placeholder="Search room, tenant, invoice..."
              className="w-full max-w-md rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
            <div className="text-sm text-muted-foreground">Premium Dashboard</div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
