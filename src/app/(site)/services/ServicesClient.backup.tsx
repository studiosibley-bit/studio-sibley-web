"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease, staggerContainer, staggerItem, reducedStaggerItem } from "@/lib/motion";

const services = [
  {
    label: "Design",
    tagline: "Build a recognizable brand.",
    items: ["Logos & Identity", "Brochure & Poster Design", "Marketing & Promo Materials", "Signage & Banners"],
  },
  {
    label: "Photo",
    tagline: "Show your business at its best.",
    items: ["Brand Photography", "Product Photography", "Events", "Headshots & Group Portraits"],
  },
  {
    label: "Video",
    tagline: "Tell your story through motion.",
    items: ["Brand Films & Ads", "Promo Videos", "Event Coverage", "Interviews"],
  },
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

  const cardVariants = reduced ? reducedStaggerItem : staggerItem;

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
      <div className="mobile-content" style={{ padding: "3.5rem 2.5rem 0", position: "relative", zIndex: 1 }}>
        <motion.div {...fu(0)}>
          <p className="section-label" style={{ marginBottom: "1.25rem" }}>Services</p>
        </motion.div>

        <motion.div {...fu(0.08)}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              margin: "0 0 1rem",
              letterSpacing: "-0.02em",
              maxWidth: "520px",
              lineHeight: 1.1,
            }}
          >
            Everything your brand<br />needs to be seen
          </h1>
        </motion.div>

        <motion.div {...fu(0.16)}>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "420px",
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            From visual identity to photography and video production, Studio Sibley helps your
            business create a cohesive brand experience anywhere your audience finds you.
          </p>
        </motion.div>

        {/* Service cards — stagger in */}
        <motion.div
          className="services-cards"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            marginBottom: "2.5rem",
            background: "rgba(51,65,85,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          {services.map((s, i) => (
            <motion.div
              key={s.label}
              variants={cardVariants}
              style={{
                padding: "1.5rem",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-coral)",
                  marginBottom: "0.5rem",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1rem",
                }}
              >
                {s.tagline}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {s.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#fff", marginTop: "1px", flexShrink: 0 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA — reveals on scroll */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease }}
        className="mobile-content"
        style={{ padding: "0 2.5rem 4rem", position: "relative", zIndex: 1 }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 0.75rem",
            lineHeight: 1.05,
          }}
        >
          Tell me your vision...
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.9rem",
            maxWidth: "480px",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}
        >
          Whether you need a single service or a complete creative package, every project is
          approached with the same attention to detail and commitment to quality.
        </p>
        <Link
          href="/connect"
          className="btn-gold"
          style={{ padding: "0.85rem 2.2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Let&apos;s Create
        </Link>
      </motion.div>
    </section>
  );
}
