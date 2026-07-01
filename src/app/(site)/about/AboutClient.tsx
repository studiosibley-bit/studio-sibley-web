"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const values = [
  {
    num: "01",
    title: "Every detail matters.",
    body: "From the logo mark to the final frame, craft isn't a bonus — it's the baseline.",
  },
  {
    num: "02",
    title: "True to you, not a template.",
    body: "I dig into what makes your work unique. No copy-paste creative direction.",
  },
  {
    num: "03",
    title: "Accessible for everyone.",
    body: "Good creative work shouldn't require a big-brand budget. Every project gets the same care.",
  },
];

export default function AboutClient({
  aboutPhotoUrl,
  bgUrl,
}: {
  aboutPhotoUrl: string | null;
  bgUrl?: string;
}) {
  const reduced = useReducedMotion();

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay, ease },
    };
  }

  return (
    <section
      style={{
        paddingTop: "68px",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/about.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mobile-content" style={{ padding: "3.5rem 2.5rem 6rem", position: "relative", zIndex: 1 }}>

        {/* ── Hero: photo + intro ───────────────────────────────────── */}
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", marginBottom: "5rem" }}>

          {/* Left: photo */}
          <motion.div
            initial={{ opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            style={{
              borderRadius: "16px",
              aspectRatio: "3/4",
              overflow: "hidden",
              position: "relative",
              background: aboutPhotoUrl ? "transparent" : "#1D2733",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.85rem",
            }}
          >
            {aboutPhotoUrl ? (
              <Image src={aboutPhotoUrl} alt="Isaiah Sibley" fill quality={90} style={{ objectFit: "cover" }} sizes="600px" />
            ) : (
              "Photo coming soon"
            )}
          </motion.div>

          {/* Right: text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <motion.div {...fu(0)}>
              <p className="section-label">About</p>
            </motion.div>

            <motion.h1
              {...fu(0.08)}
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                margin: 0,
              }}
            >
              The story behind<br />Studio Sibley
            </motion.h1>

            <motion.p
              {...fu(0.18)}
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
              }}
            >
              Bad design, rushed photography, and generic video tell people not to take you seriously
              before you&apos;ve had a chance to speak. Studio Sibley exists to fix that — helping
              businesses and creators show up with visuals that feel true to who they are, at any budget.
            </motion.p>

            <motion.div {...fu(0.26)}>
              <Link
                href="/connect"
                className="btn-gold"
                style={{ padding: "0.85rem 2rem", fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Let&apos;s Work Together
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Values ───────────────────────────────────────────────── */}
        <div
          className="about-values"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "3rem",
          }}
        >
          {values.map((v, i) => (
            <motion.div
              key={v.num}
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-coral)", lineHeight: 1, margin: 0, opacity: 0.65 }}>
                {v.num}
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                {v.title}
              </p>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
