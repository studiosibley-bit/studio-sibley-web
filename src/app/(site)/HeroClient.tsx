"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { fadeUp, reducedFadeUp } from "@/lib/motion";

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

export default function HeroClient({
  testimonials,
  bgUrl,
}: {
  testimonials: Testimonial[];
  bgUrl?: string;
}) {
  const reduced = useReducedMotion();
  const variants = reduced ? reducedFadeUp : fadeUp;

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: "7rem 5vw 4rem",
        position: "relative",
        overflow: "hidden",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/hero.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <motion.h1
          style={{
            fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 1.5rem",
            color: "#fff",
          }}
          custom={0}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          What It Looks<br />
          Like{" "}
          <span style={{
            background: "linear-gradient(90deg, var(--color-gold), var(--color-coral))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Matters</span>
        </motion.h1>

        <motion.p
          style={{
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.65,
            maxWidth: "420px",
            marginBottom: "2.5rem",
          }}
          custom={0.15}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          Photo, video, and design for anyone with a story worth telling.
        </motion.p>

        <motion.div
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "4rem" }}
          custom={0.25}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <Link href="/projects" className="btn-gold" style={{ padding: "0.75rem 1.8rem", fontSize: "0.9rem", fontWeight: 700 }}>
            View Work
          </Link>
          <Link href="#demo" className="btn-outline-light" style={{ padding: "0.75rem 1.8rem", fontSize: "0.9rem" }}>
            Watch Demo Reel
          </Link>
        </motion.div>

        <motion.div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}
          custom={0.35}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t._id}
              whileHover={reduced ? undefined : { y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                background: "rgba(51,65,85,0.55)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "1.75rem",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
                {Array.from({ length: t.rating ?? 5 }).map((_, s) => (
                  <span key={s} style={{ color: "var(--color-gold)", fontSize: "0.85rem" }}>★</span>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{t.name}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "3px" }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
