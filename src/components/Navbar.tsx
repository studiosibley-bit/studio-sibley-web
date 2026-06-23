"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(0, 22, 42, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(51,65,85,0.4)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark size={30} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname.startsWith(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/connect"
            className="btn-outline-coral px-5 py-2 text-sm"
            style={{ letterSpacing: "0.07em", fontSize: "0.78rem" }}
          >
            LET'S CREATE
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--color-white)",
              transform: menuOpen ? "rotate(45deg) translate(3px, 7px)" : "none",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--color-white)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "var(--color-white)",
              transform: menuOpen ? "rotate(-45deg) translate(3px, -7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-5"
          style={{
            background: "rgba(0,22,42,0.97)",
            backdropFilter: "blur(12px)",
          }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link text-base${pathname.startsWith(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/connect"
            className="btn-outline-coral px-5 py-2.5 text-sm w-fit"
            style={{ letterSpacing: "0.07em" }}
          >
            LET'S CREATE
          </Link>
        </div>
      )}
    </header>
  );
}
