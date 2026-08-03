import Link from "next/link";
import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-forest text-paper/80 mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display text-lg text-paper mb-3">
            <Mountain className="h-5 w-5 text-rust" />
            GEARUP
          </div>
          <p className="text-sm max-w-xs">
            Rent sports and outdoor gear instantly. Trailheads to summits, we&apos;ve got the kit.
          </p>
        </div>
        <div>
          <p className="tag-label text-paper mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/gear" className="hover:text-rust transition-colors">
                Browse Gear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="tag-label text-paper mb-3">Account</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/auth/login" className="hover:text-rust transition-colors">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="hover:text-rust transition-colors">
                Create account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">
        &copy; {new Date().getFullYear()} GearUp. Built for Assignment 5.
      </div>
    </footer>
  );
}