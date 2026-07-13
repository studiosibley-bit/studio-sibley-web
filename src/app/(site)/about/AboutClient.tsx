"use client";

import Link from "next/link";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";

// ─── Copy ────────────────────────────────────────────────────────────────────
// The founder story, distributed across the page's sections.
const heroSubtitle = "I'm the founder of Studio Sibley.";

const storyHeading =
  "It all started with making short films on an iPad, which quickly grew into a passion for filmmaking.";
const storySub =
  "In high school, I launched a photography business, offering prom and graduation portraits to classmates.";

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

// ─── Photo slot — real image, or an on-brand placeholder until one is set ────

function PhotoSlot({ url, alt, label, style }: {
  url: string | null;
  alt: string;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#0d1826", ...style }}>
      {url ? (
        <ImageWithPlaceholder src={url} alt={alt} fill quality={90} style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
      ) : (
        <div
          style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
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
  aboutPhotoUrl,
  storyPhotoUrl,
  bgUrl,
}: {
  aboutPhotoUrl: string | null;
  storyPhotoUrl: string | null;
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
        paddingTop: "var(--nav-offset)",
        position: "relative",
        overflow: "hidden",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/about.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Standard page wrapper — same as every other page, so the "About Me"
          label lands at the site header height (nav-offset + --space-56) and
          every section shares one consistent vertical gap. */}
      <div className="mobile-content" style={{ padding: "var(--space-56) var(--gutter) var(--space-96)", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(var(--space-56), 7vw, var(--space-80))" }}>

          {/* Hero text. The portrait returns to the right once provided —
              aboutPhotoUrl stays wired for it. */}
          <div style={{ maxWidth: "760px" }}>
            <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>About Me</p>
            <h1 style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.04, margin: "0 0 var(--space-24)", color: "#fff" }}>
              Hi, I&apos;m<br />
              <span className="gold-text">Isaiah Sibley.</span>
            </h1>
            <p style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0, maxWidth: "34ch" }}>
              {heroSubtitle}
            </p>
          </div>

          {/* The Story — heading + body left, photo right */}
          <div className="about-story" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(var(--space-32), 5vw, var(--space-64))", alignItems: "start" }}>
            <div>
              <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>The Story</p>
              <h2 style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.85rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0, color: "#fff" }}>
                {storyHeading} {storySub}
              </h2>
            </div>
            <PhotoSlot
              url={storyPhotoUrl}
              alt="Filming on an iPad"
              label="Story photo"
              style={{ borderRadius: "16px", aspectRatio: "4 / 3", width: "100%" }}
            />
          </div>

          {/* Timeline */}
          <Timeline steps={steps} />

          {/* The Mission — card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "22px",
              padding: "clamp(var(--space-32), 5vw, var(--space-56))",
            }}
          >
            <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>The Mission</p>
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
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-12)", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.02em" }}
            >
              Let&apos;s Create Together
              <span aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.14)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
