"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons" },
  { href: "/ministries", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const overlayNav = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          overlayNav
            ? "bg-transparent"
            : "bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#EAE2D6] shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className={cn(
                "font-serif text-xl font-semibold tracking-tight transition-colors duration-300",
                overlayNav ? "text-white" : "text-[#1C3A2E]"
              )}
            >
              Trinity Chapel
            </span>
            <span
              className={cn(
                "text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-300",
                overlayNav ? "text-white/70" : "text-[#C9A845]"
              )}
            >
              Thika
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-sans tracking-wide transition-colors duration-200",
                  pathname === href
                    ? overlayNav
                      ? "text-[#C9A845]"
                      : "text-[#C9A845]"
                    : overlayNav
                    ? "text-white/85 hover:text-white"
                    : "text-[#1C3A2E]/80 hover:text-[#1C3A2E]"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/give"
              className={cn(
                "ml-2 px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200",
                overlayNav
                  ? "bg-[#C9A845] text-white hover:bg-[#A8892E]"
                  : "bg-[#1C3A2E] text-white hover:bg-[#2D6A4F]"
              )}
            >
              Give
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              overlayNav ? "text-white hover:bg-white/10" : "text-[#1C3A2E] hover:bg-[#1C3A2E]/10"
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-[#0F2019]/60 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-[#FAFAF7] shadow-2xl transition-transform duration-300 flex flex-col",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE2D6]">
            <span className="font-serif text-[#1C3A2E] text-lg font-semibold">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-lg text-[#1C3A2E] hover:bg-[#1C3A2E]/10"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-3 rounded-lg text-base font-sans transition-colors",
                  pathname === href
                    ? "bg-[#1C3A2E] text-white"
                    : "text-[#1C3A2E] hover:bg-[#1C3A2E]/8"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-8">
            <Link
              href="/give"
              className="block w-full text-center px-5 py-3 rounded-full bg-[#C9A845] text-white font-sans font-medium hover:bg-[#A8892E] transition-colors"
            >
              Give
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
