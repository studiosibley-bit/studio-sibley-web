"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <section
      className="relative min-h-screen overflow-hidden pt-24 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <GradientBlob opacity={0.3} size={600} className="-top-20 -right-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
            style={{
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.05em",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            ← Back to Projects
          </Link>
        </motion.div>

        {/* Cover image placeholder */}
        <motion.div
          className="w-full rounded-2xl mb-10 flex items-center justify-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid rgba(51,65,85,0.5)",
            height: "min(60vh, 500px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
            Cover image via Sanity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <span
            className="section-label"
            style={{ color: "var(--color-coral)" }}
          >
            Design · Identity
          </span>
          <h1
            className="font-extrabold mt-2 mb-6"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {params.slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </h1>
        </motion.div>

        {/* Gallery grid placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-xl flex items-center justify-center"
              style={{
                background: "var(--color-surface)",
                border: "1px solid rgba(51,65,85,0.4)",
                aspectRatio: i === 0 ? "16/9" : "4/3",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
            >
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.75rem" }}>
                Gallery image
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
