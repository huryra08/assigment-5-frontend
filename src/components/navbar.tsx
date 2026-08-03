"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, Mountain, LogOut, User as UserIcon } from "lucide-react";

const dashboardHref: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display text-lg text-forest">
            <Mountain className="h-6 w-6 text-rust" strokeWidth={2.5} />
            GEARUP
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link href="/gear" className="hover:text-rust transition-colors">
              Browse Gear
            </Link>
            {!loading && user && (
              <Link href={dashboardHref[user.role]} className="hover:text-rust transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!loading && !user && (
              <>
                <Link href="/auth/login" className="text-sm font-medium hover:text-rust transition-colors">
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-rust text-paper px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-rust-deep transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
            {!loading && user && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                  <UserIcon className="h-4 w-4" />
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium hover:text-rust transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-canvas px-4 py-4 space-y-3">
          <Link href="/gear" className="block text-sm font-medium" onClick={() => setOpen(false)}>
            Browse Gear
          </Link>
          {!loading && user && (
            <Link
              href={dashboardHref[user.role]}
              className="block text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!loading && !user && (
            <>
              <Link href="/auth/login" className="block text-sm font-medium" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/auth/register" className="block text-sm font-medium" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </>
          )}
          {!loading && user && (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="block text-sm font-medium"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
