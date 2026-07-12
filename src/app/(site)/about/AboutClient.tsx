"use client";

import Link from "next/link";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

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
  return (
    <section
      style={{
        paddingTop: "var(--nav-offset)",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/about.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mobile-content" style={{ padding: "var(--space-56) var(--gutter) var(--space-64)", position: "relative", zIndex: 1 }}>
        <div>
          <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>About</p>
        </div>

        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "var(--space-64)", alignItems: "start" }}>
          {/* Left — text */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "0 0 var(--space-28)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                The Story Behind Studio Sibley
              </h1>
            </div>

            <div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "var(--space-24)" }}>
                {para1}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", lineHeight: 1.35, borderLeft: "3px solid var(--color-coral)", paddingLeft: "var(--space-16)", marginBottom: "var(--space-24)" }}>
                {callout}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "var(--space-24)" }}>
                {para2}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "rgba(255,255,255,0.65)", marginBottom: "var(--space-36)" }}>
                {para3}
              </p>
            </div>

            <div>
              <Link
                href="/connect"
                className="btn-gold"
                style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Want to Work Together?
              </Link>
            </div>
          </div>

          {/* Right — photo */}
          <div
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
              <ImageWithPlaceholder src={aboutPhotoUrl} alt="Isaiah Sibley" fill quality={90} style={{ objectFit: "cover" }} sizes="500px" />
            ) : (
              "My Photo"
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
