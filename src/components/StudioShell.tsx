import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Picker" },
  { to: "/palettes", label: "Palettes" },
  { to: "/saved", label: "Saved" },
] as const;

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-display text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="hero-grad grid size-9 place-items-center rounded-lg text-lg font-bold text-background">
            P
          </span>
          <span className="text-sm font-semibold tracking-wide">Prisma</span>
        </Link>
        <nav className="flex items-center gap-5 text-xs md:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="mt-10 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 font-mono text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>Prisma Color Studio</span>
          <span>Export · CSS · SCSS · Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
