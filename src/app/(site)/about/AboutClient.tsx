"use client";

import Link from "next/link";
import Image from "next/image";

// ─── Copy ────────────────────────────────────────────────────────────────────
// The founder story, distributed across the page's sections.
const storyHeading =
  "My passion for creating all started with making short films on an iPad, which quickly grew into filmmaking.";
const storySub =
  "In high school, I launched a photography business, offering prom and graduation portraits to classmates.";

// Shared by the hero row's minHeight and the portrait's own height, so the
// portrait's bottom (anchored via bottom:0) always lines up with the row's
// bottom edge — which, since the panel below it has no bottom padding, is
// also the panel's own bottom edge.
const HERO_PHOTO_HEIGHT = "clamp(280px, 29vw, 400px)";
// The row (and thus the panel, which has no bottom padding of its own) can
// be shorter than the photo without clipping it behind the fixed navbar —
// the photo's top just rises above the row's top by the difference. 40px of
// rise still clears the navbar (nav-offset 68px) with a little margin.
const HERO_ROW_MIN_HEIGHT = `calc(${HERO_PHOTO_HEIGHT} - 40px)`;
// Matches the trimmed portrait's actual pixel dimensions (1600x1516 — the
// source had 84px of transparent margin above the hair, now cropped out),
// so the box has no letterboxing.
const HERO_PHOTO_ASPECT = "1600 / 1516";

// Section spacing below the hero. TIGHT is used between the story paragraph
// and the timeline, and — at the same value — between the timeline and the
// mission card. WIDE is the original, larger rhythm, kept for mission→CTA.
const SECTION_GAP_TIGHT = "clamp(var(--space-24), 4vw, var(--space-40))";
const SECTION_GAP_WIDE = "clamp(var(--space-56), 7vw, var(--space-80))";

// ─── Gradient-stroked line icons (one per timeline step) ─────────────────────

function IconPeople() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="url(#ic-people)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <linearGradient id="ic-people" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD694" /><stop offset="1" stopColor="#FF966F" />
        </linearGradient>
      </defs>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#ic-pencil)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <linearGradient id="ic-pencil" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD694" /><stop offset="1" stopColor="#FF966F" />
        </linearGradient>
      </defs>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="url(#ic-eye)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <linearGradient id="ic-eye" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD694" /><stop offset="1" stopColor="#FF966F" />
        </linearGradient>
      </defs>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

type Step = { icon: React.ReactNode; heading: React.ReactNode };

function Timeline({ steps }: { steps: Step[] }) {
  const dash = "1px dashed rgba(255,255,255,0.22)";
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {steps.map((s, i) => {
        const first = i === 0;
        const last = i === steps.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: "var(--space-32)", alignItems: "stretch" }}>
            {/* Icon column — the circle is vertically centered against the text
                via the two flex spacers, and the dashed spacers connect one
                icon to the next (no line above the first / below the last). */}
            <div style={{ flexShrink: 0, width: 92, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ flex: 1, minHeight: "var(--space-40)", borderLeft: first ? "none" : dash }} />
              <div
                className="about-timeline-icon"
                style={{
                  width: 92, height: 92, borderRadius: "50%", flexShrink: 0, margin: "var(--space-8) 0",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {s.icon}
              </div>
              <div style={{ flex: 1, minHeight: "var(--space-40)", borderLeft: last ? "none" : dash }} />
            </div>

            {/* Text column — spans the full remaining width, centered vertically
                against the icon. */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "var(--space-24)", paddingBottom: "var(--space-24)" }}>
              <h3 style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.85rem)", fontWeight: 700, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.01em", margin: 0 }}>
                {s.heading}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutClient({
  bgUrl,
}: {
  bgUrl?: string;
}) {
  const steps: Step[] = [
    {
      icon: <IconPeople />,
      heading: (
        <>
          Around that same time, a conversation with a family friend and graphic designer{" "}
          <span className="gold-text">changed the direction</span> of my creative journey. I was
          encouraged to create anything and everything.
        </>
      ),
    },
    {
      icon: <IconPencil />,
      heading: (
        <>
          That mindset led me to <span className="gold-text">immerse myself</span> in design,
          photography, and filmmaking. Over time, I developed an eye for what makes creative work
          effective and an understanding of its business value.
        </>
      ),
    },
    {
      icon: <IconEye />,
      heading: (
        <>
          I also noticed that many businesses, organizations, and individuals were{" "}
          <span className="gold-text">held back</span> by visuals and marketing that failed to
          reflect the quality of what they offered.
        </>
      ),
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/about.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Full-bleed hero panel — spans the full viewport edge-to-edge and
          starts at the true top of the screen (behind the fixed navbar), so
          "About Me" lands at the exact same header height as every other
          page (nav-offset + --space-56). The portrait now lives inside this
          panel too, rather than sharing a small text-hugging card with it.
          It's a transparent-background cutout, so it blends into the panel
          on its own (no fade-gradient overlay needed). */}
      <div style={{ position: "relative", background: "rgba(0,22,42,0.75)", paddingTop: "var(--nav-offset)" }}>
        {/* No bottom padding here — the portrait's bottom (anchored via
            bottom:0 below) lands exactly on the panel's own bottom edge,
            so "portrait bottom aligned with panel bottom" is structural,
            not just matching numbers. */}
        <div className="mobile-content" style={{ padding: "var(--space-56) var(--gutter) 0", position: "relative" }}>
          <div className="about-hero" style={{ position: "relative", display: "flex", alignItems: "flex-start", minHeight: HERO_ROW_MIN_HEIGHT }}>
            <div className="about-hero-text" style={{ position: "relative", zIndex: 1 }}>
              <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>About Me</p>
              <h1 style={{ fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.04, margin: 0, color: "#fff" }}>
                Hi, I&apos;m<br />
                <span className="gold-text">Isaiah Sibley.</span>
              </h1>
            </div>
            <div
              className="about-hero-photo"
              style={{ position: "absolute", bottom: 0, right: "clamp(60px, 6.5vw, 110px)", height: HERO_PHOTO_HEIGHT, aspectRatio: HERO_PHOTO_ASPECT, pointerEvents: "none" }}
            >
              <Image
                src="/portraits/isaiah-about.png"
                alt="Isaiah Sibley"
                fill
                priority
                quality={90}
                style={{ objectFit: "contain", objectPosition: "bottom" }}
                sizes="(max-width: 768px) 60vw, 420px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Standard page wrapper for everything below the hero panel — same as
          every other page. No top padding here since the panel above already
          ends with its own bottom breathing room. */}
      <div className="mobile-content" style={{ padding: "0 var(--gutter) var(--space-96)", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", paddingTop: "clamp(var(--space-40), 5vw, var(--space-56))" }}>

          {/* The Story — full-width, left-justified */}
          <div style={{ marginBottom: SECTION_GAP_TIGHT }}>
            <h2 style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.85rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0, color: "#fff" }}>
              {storyHeading} {storySub}
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: SECTION_GAP_TIGHT }}>
            <Timeline steps={steps} />
          </div>

          {/* The Mission — card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "22px",
              padding: "clamp(var(--space-32), 5vw, var(--space-56))",
              marginBottom: SECTION_GAP_WIDE,
            }}
          >
            <p style={{ fontSize: "clamp(1.4rem, 3vw, 2.3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.35, letterSpacing: "-0.01em", margin: 0 }}>
              Studio Sibley was built to help entrepreneurs, musicians, nonprofits, churches,
              creators, and personal brands present themselves with the{" "}
              <span className="gold-text">same care</span> they put into what they do.
            </p>
          </div>

          {/* Closing CTA — centered */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/connect"
              className="btn-gold"
              style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
            >
              Let&apos;s Create
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
