"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const para1 =
  "A lot of genuinely great work gets overlooked because the visuals aren't keeping up. Bad design, rushed photography, and generic video can tell people not to take you seriously before you've even had a chance to speak for yourself.";
const callout = "That's what Studio Sibley was built to fix.";
const para2 =
  "I started this studio because good creative work should be available to everyone, not just big brands with big budgets. Whether you're a business, a creator, an artist, or just someone with something worth capturing, how you present yourself visually has never mattered more.";
const para3 =
  "My job is to help you show up in a way that feels true to who you are. A logo that actually fits, photos that represent what you do, video that connects. I put the same care into every project regardless of scope, because whatever your story is, it deserves to be told well.";

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
      <div className="mobile-content" style={{ padding: "3.5rem 2.5rem 4rem", position: "relative", zIndex: 1 }}>
        <motion.div {...fu(0)}>
          <p className="section-label" style={{ marginBottom: "1.25rem" }}>About</p>
        </motion.div>

        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "4rem", alignItems: "start" }}>
          {/* Left — text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <motion.div {...fu(0.08)}>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "0 0 1.75rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                The Story Behind Studio Sibley
              </h1>
            </motion.div>

            <motion.div {...fu(0.16)}>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "1.5rem" }}>
                {para1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: reduced ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease }}
            >
              <p style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", lineHeight: 1.35, borderLeft: "3px solid var(--color-coral)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
                {callout}
              </p>
            </motion.div>

            <motion.div {...fu(0.32)}>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "1.5rem" }}>
                {para2}
              </p>
            </motion.div>

            <motion.div {...fu(0.38)}>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "2.25rem" }}>
                {para3}
              </p>
            </motion.div>

            <motion.div {...fu(0.44)}>
              <Link
                href="/connect"
                className="btn-gold"
                style={{ padding: "0.85rem 2rem", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Want to Work Together?
              </Link>
            </motion.div>
          </div>

          {/* Right — photo */}
          <motion.div
            initial={{ opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease }}
            style={{
              borderRadius: "16px",
              aspectRatio: "4/5",
              maxHeight: "480px",
              overflow: "hidden",
              position: "relative",
              background: aboutPhotoUrl ? "transparent" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(0,0,0,0.35)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {aboutPhotoUrl ? (
              <Image src={aboutPhotoUrl} alt="Isaiah Sibley" fill quality={90} style={{ objectFit: "cover" }} sizes="500px" />
            ) : (
              "My Photo"
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
