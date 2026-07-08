"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";

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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
        background: scrolled ? "rgba(0,22,42,0.88)" : "rgba(0,22,42,0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: scrolled ? "1px solid rgba(51,65,85,0.4)" : "none",
        zIndex: 250,
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="Studio Sibley home">
          <Image
            src="/horizontal_logo.png"
            alt="Studio Sibley"
            width={161}
            height={30}
            priority
            style={{ height: "30px", width: "auto" }}
          />
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
            className="btn-outline-coral"
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.88rem" }}
          >
            Let&apos;s Create
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              background: "var(--color-white)",
              transform: menuOpen ? "rotate(45deg) translate(3px, 7px)" : "none",
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{ background: "var(--color-white)", opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              background: "var(--color-white)",
              transform: menuOpen ? "rotate(-45deg) translate(3px, -7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu — animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease }}
            className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-5"
            style={{ background: "rgba(0,22,42,0.97)", backdropFilter: "blur(12px)" }}
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06, ease }}
              >
                <Link
                  href={href}
                  className={`nav-link text-base${pathname.startsWith(href) ? " active" : ""}`}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: navLinks.length * 0.06, ease }}
            >
              <Link
                href="/connect"
                className="btn-outline-coral w-fit"
                style={{ padding: "0.5rem 1.2rem", fontSize: "0.88rem" }}
              >
                Let&apos;s Create
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
