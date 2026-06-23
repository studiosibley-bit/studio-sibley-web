"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoMark from "@/components/LogoMark";

export default function NotFound() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6"
      style={{ background: "var(--color-bg)" }}
    >
      <GradientBlob opacity={0.35} size={700} className="-bottom-32 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <LogoMark size={40} />

        <motion.h1
          className="font-extrabold leading-none"
          style={{ fontSize: "clamp(6rem, 20vw, 14rem)", fontWeight: 800, color: "var(--color-coral)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300, fontSize: "1.1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          This page doesn't exist — but your brand can.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Link href="/" className="btn-coral px-7 py-3 text-sm" style={{ letterSpacing: "0.06em" }}>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
