"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/portfolio-data";
import { useTheme } from "@/components/providers/theme-provider";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b-2 border-foreground bg-background/88 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="#top" className="font-display text-xl font-black uppercase">
          Hasnane<span className="text-coral">.</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-bold uppercase transition-colors hover:bg-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button size="icon" variant="secondary" className="md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>
      {open ? (
        <div className="border-t-2 border-foreground bg-background md:hidden">
          <div className="container grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-2 border-foreground bg-muted px-4 py-3 font-display text-lg font-black uppercase shadow-brutal-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
