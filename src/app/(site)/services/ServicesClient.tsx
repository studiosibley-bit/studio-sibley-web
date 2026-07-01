"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const services = [
  {
    num: "01",
    label: "Design",
    tagline: "Build a brand people remember.",
    items: ["Logos & Identity", "Brochure & Poster Design", "Marketing & Promo Materials", "Signage & Banners"],
  },
  {
    num: "02",
    label: "Photo",
    tagline: "Show your business at its best.",
    items: ["Brand Photography", "Product Photography", "Events", "Headshots & Group Portraits"],
  },
  {
    num: "03",
    label: "Video",
    tagline: "Tell your story through motion.",
    items: ["Brand Films & Ads", "Promo Videos", "Event Coverage", "Interviews"],
  },
];

const process = [
  { num: "01", title: "Discovery", body: "We talk through your vision, goals, and what success looks like for you." },
  { num: "02", title: "Creative Direction", body: "I develop a direction and present concepts for your feedback." },
  { num: "03", title: "Production", body: "We bring it to life — photo sessions, design rounds, or video production." },
  { num: "04", title: "Delivery", body: "Final files in every format you need, ready to use anywhere." },
];

export default function ServicesClient({ bgUrl }: { bgUrl?: string }) {
  const reduced = useReducedMotion();

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay, ease },
    };
  }

  function wiv(delay = 0) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.5, delay, ease },
    };
  }

  return (
    <section
      style={{
        paddingTop: "68px",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/services.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mobile-content" style={{ padding: "3.5rem 2.5rem 6rem", position: "relative", zIndex: 1 }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div {...fu(0)} style={{ marginBottom: "0.75rem" }}>
          <p className="section-label">Services</p>
        </motion.div>

        <motion.h1
          {...fu(0.08)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            margin: "0 0 4rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Everything your brand<br />needs to be seen
        </motion.h1>

        {/* ── Service rows ──────────────────────────────────────────── */}
        {services.map((s, i) => (
          <motion.div
            key={s.label}
            className="service-row"
            {...wiv(i * 0.06)}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "2.75rem 0",
              display: "grid",
              gridTemplateColumns: "5rem 1fr 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Number */}
            <p style={{ fontSize: "2.75rem", fontWeight: 800, color: "var(--color-coral)", opacity: 0.45, lineHeight: 1, margin: 0, paddingTop: "0.15rem" }}>
              {s.num}
            </p>

            {/* Label + tagline */}
            <div>
              <p style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 0.6rem" }}>
                {s.label}
              </p>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", fontStyle: "italic", margin: 0 }}>
                {s.tagline}
              </p>
            </div>

            {/* Offerings */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {s.items.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                  <span style={{ color: "var(--color-coral)", flexShrink: 0, marginTop: "1px" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* ── How it works ──────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "0.5rem", paddingTop: "4rem" }}>
          <motion.p
            {...wiv()}
            style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "3rem" }}
          >
            How it works
          </motion.p>

          <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2.5rem" }}>
            {process.map((step, i) => (
              <motion.div key={step.num} {...wiv(i * 0.08)} style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-gold)", opacity: 0.55, lineHeight: 1, margin: 0 }}>
                  {step.num}
                </p>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                  {step.title}
                </p>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <motion.div
          {...wiv(0.1)}
          style={{
            marginTop: "5rem",
            paddingTop: "4rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 0.5rem" }}>
              Tell me your vision.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: 0 }}>
              Every project gets the same attention, regardless of scope.
            </p>
          </div>
          <Link
            href="/connect"
            className="btn-gold"
            style={{ padding: "0.85rem 2.2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0 }}
          >
            Let&apos;s Create
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
