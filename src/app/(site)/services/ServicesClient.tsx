"use client";

import { useRef } from "react";
import ConnectLink from "@/components/ConnectLink";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ease } from "@/lib/motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Chapter = {
  key: "design" | "photo" | "video";
  num: string;
  label: string;
  heading: string;
  statement: string;
  items: string[];
};

const chapters: Chapter[] = [
  {
    key: "design",
    num: "01",
    label: "Design",
    heading: "DESIGN",
    statement: "Build a recognizable brand.",
    items: ["Logos & Identity", "Brochure & Poster Design", "Marketing & Promotional Materials", "Signage & Banners"],
  },
  {
    key: "photo",
    num: "02",
    label: "Photo",
    heading: "PHOTO",
    statement: "Show your business at its best.",
    items: ["Brand Photography", "Product Photography", "Events", "Headshots & Group Portraits"],
  },
  {
    key: "video",
    num: "03",
    label: "Video",
    heading: "VIDEO",
    statement: "Tell your story through motion.",
    items: ["Brand Films & Ads", "Promotional Videos", "Event Coverage", "Interviews"],
  },
];

// Scroll windows within the sticky track (progress 0 → 1). Windows abut with a
// small dead-zone baked into each panel's fade curve, so only one slide is ever
// on screen — no two overlap, even faintly.
//
// The sequence is symmetric: it begins pinned on the centered intro slide and
// ends pinned on the centered CTA slide. Intro → Design → Photo → Video each
// fade in, hold, and fade out. The CTA is the FINAL slide: it fades in near the
// very end (CTA_IN) and then HOLDS at full opacity with no fade-out. It reaches
// 100% at CTA_IN[1] (just before progress 1), so there's a brief static beat
// where it sits fully revealed — then the sticky container reaches the end of
// its track, unpins, and the CTA scrolls naturally up into the footer. That
// post-pin scroll (one viewport, inherent to position:sticky) is the intended
// "short section of normal scrolling" between the finished CTA and the footer.
// Everything is scroll-progress-driven, so scrolling back up reverses exactly.
const INTRO: [number, number] = [0, 0.12];
const SEGMENTS: Record<Chapter["key"], [number, number]> = {
  design: [0.12, 0.35],
  photo: [0.35, 0.58],
  video: [0.58, 0.87],
};
// CTA fade-in window: fades in right after Video clears, reaches full at the
// end of this window, then holds (no fade-out) through the pin release.
const CTA_IN: [number, number] = [0.87, 0.94];

// Fraction of a chapter's window spent fading in / out (steep = crisp cut).
const FADE = 0.18;
// Hard gap at each window edge where the panel is fully transparent.
const GAP = 0.04;

// ─── Small building blocks ──────────────────────────────────────────────────

function ServiceItem({
  progress,
  range,
  label,
  reduced,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  label: string;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, reduced ? [0, 0] : [26, 0]);

  return (
    <motion.li
      style={{
        opacity,
        y,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-16)",
        fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
        fontWeight: 500,
        color: "rgba(255,255,255,0.92)",
        letterSpacing: "-0.01em",
      }}
    >
      <span style={{ width: "26px", height: "1.5px", background: "var(--color-coral)", flexShrink: 0 }} />
      {label}
    </motion.li>
  );
}

function itemRange(seg: [number, number], i: number): [number, number] {
  const [start, end] = seg;
  const span = end - start;
  const inFull = start + span * FADE;
  const outStart = end - span * FADE;
  const band = outStart - inFull;
  const s = inFull + band * 0.06 + i * band * 0.14;
  const e = s + band * 0.34;
  return [s, Math.min(e, outStart)];
}

// Right-edge progress rail — dims/brightens per active chapter.
function RailItem({
  progress,
  seg,
  label,
  num,
  reduced,
}: {
  progress: MotionValue<number>;
  seg: [number, number];
  label: string;
  num: string;
  reduced: boolean;
}) {
  const [start, end] = seg;
  const active = useTransform(progress, [start - 0.02, start + 0.04, end - 0.04, end + 0.02], [0, 1, 1, 0]);
  const color = useTransform(active, [0, 1], ["rgba(255,255,255,0.4)", "#ffffff"]);
  const lineWidth = useTransform(active, [0, 1], ["14px", "34px"]);
  // Interpolate to a hex, not var(--color-coral) — framer can't animate a CSS var.
  const lineBg = useTransform(active, [0, 1], ["rgba(255,255,255,0.3)", "#FF966F"]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", justifyContent: "flex-end" }}>
      <motion.span
        style={{
          color,
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {num} {label}
      </motion.span>
      <motion.span style={{ width: reduced ? "20px" : lineWidth, height: "2px", background: lineBg, flexShrink: 0 }} />
    </div>
  );
}

// ─── Decorative layers (one per discipline) ─────────────────────────────────

function DesignDecor({ progress, seg, reduced }: { progress: MotionValue<number>; seg: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, [seg[0], seg[0] + 0.06, seg[1] - 0.06, seg[1]], [0, 0.5, 0.5, 0]);
  const y = useTransform(progress, seg, reduced ? [0, 0] : [40, -40]);
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        y,
        pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(circle at 70% 40%, black, transparent 68%)",
        WebkitMaskImage: "radial-gradient(circle at 70% 40%, black, transparent 68%)",
      }}
    />
  );
}

function PhotoDecor({ progress, seg, reduced }: { progress: MotionValue<number>; seg: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, [seg[0], seg[0] + 0.06, seg[1] - 0.06, seg[1]], [0, 1, 1, 0]);
  const yA = useTransform(progress, seg, reduced ? [0, 0] : [70, -70]);
  const yB = useTransform(progress, seg, reduced ? [0, 0] : [-50, 50]);

  const frame = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "linear-gradient(135deg, rgba(255,150,111,0.10), rgba(255,255,255,0.03))",
    backdropFilter: "blur(2px)",
    ...extra,
  });

  return (
    <motion.div aria-hidden style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <motion.div style={{ ...frame({ right: "9%", top: "16%", width: "clamp(160px, 20vw, 320px)", aspectRatio: "4/5" }), y: yA }} />
      <motion.div style={{ ...frame({ right: "24%", bottom: "14%", width: "clamp(120px, 15vw, 240px)", aspectRatio: "3/2" }), y: yB }} />
    </motion.div>
  );
}

function VideoDecor({ progress, seg, reduced }: { progress: MotionValue<number>; seg: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, [seg[0], seg[0] + 0.06, seg[1] - 0.06, seg[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, seg, reduced ? [0, 0] : [50, -50]);
  const playhead = useTransform(progress, seg, ["4%", "96%"]);
  const barIn = useTransform(progress, [seg[0], seg[0] + 0.07, seg[1] - 0.07, seg[1]], ["0vh", "7vh", "7vh", "0vh"]);

  return (
    <motion.div aria-hidden style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {/* Letterbox bars */}
      <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barIn, background: "rgba(0,0,0,0.55)" }} />
      <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barIn, background: "rgba(0,0,0,0.55)" }} />

      {/* Floating video frame with playhead timeline */}
      <motion.div
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          y,
          translateY: "-50%",
          width: "clamp(220px, 26vw, 420px)",
          aspectRatio: "16/9",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "13px solid transparent",
            borderBottom: "13px solid transparent",
            borderLeft: "22px solid rgba(255,255,255,0.85)",
            marginLeft: 5,
          }}
        />
        {/* timeline track */}
        <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "12%", height: "2px", background: "rgba(255,255,255,0.2)" }} />
        <motion.div
          style={{ position: "absolute", bottom: "12%", left: playhead, width: "2px", height: "16px", marginBottom: "-7px", background: "var(--color-coral)" }}
        />
      </motion.div>
    </motion.div>
  );
}

function Decor({ chapter, progress, seg, reduced }: { chapter: Chapter["key"]; progress: MotionValue<number>; seg: [number, number]; reduced: boolean }) {
  if (chapter === "design") return <DesignDecor progress={progress} seg={seg} reduced={reduced} />;
  if (chapter === "photo") return <PhotoDecor progress={progress} seg={seg} reduced={reduced} />;
  return <VideoDecor progress={progress} seg={seg} reduced={reduced} />;
}

// ─── Chapter panel ──────────────────────────────────────────────────────────

function ChapterPanel({
  data,
  seg,
  progress,
  reduced,
}: {
  data: Chapter;
  seg: [number, number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const [start, end] = seg;
  const span = end - start;
  // Dead-zone at each edge (fully transparent) then a steep fade — guarantees
  // the previous chapter is gone before this one appears.
  const inStart = start + span * GAP;
  const inFull = start + span * FADE;
  const outStart = end - span * FADE;
  const outEnd = end - span * GAP;
  const stops = [inStart, inFull, outStart, outEnd];

  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  const contentY = useTransform(progress, stops, reduced ? [0, 0, 0, 0] : [50, 0, 0, -45]);
  const contentScale = useTransform(progress, stops, reduced ? [1, 1, 1, 1] : [0.96, 1, 1, 0.98]);
  const watermarkY = useTransform(progress, seg, reduced ? [0, 0] : [90, -90]);
  const watermarkOpacity = useTransform(progress, stops, [0, 0.05, 0.05, 0]);
  // Hard gate: only rendered while its window is active, so chapters can never
  // bleed into one another regardless of opacity easing.
  const visibility = useTransform(progress, (p) => (p >= start && p <= end ? "visible" : "hidden"));

  return (
    <motion.div
      style={{ position: "absolute", inset: 0, opacity, visibility, display: "flex", alignItems: "center" }}
    >
      {/* Giant watermark word */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          left: "-3vw",
          top: "50%",
          translateY: "-50%",
          y: watermarkY,
          opacity: watermarkOpacity,
          fontSize: "clamp(9rem, 30vw, 26rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#fff",
          whiteSpace: "nowrap",
          lineHeight: 0.8,
          pointerEvents: "none",
        }}
      >
        {data.heading}
      </motion.span>

      <Decor chapter={data.key} progress={progress} seg={seg} reduced={reduced} />

      {/* Foreground content — side padding matches every other page's
          mobile-content wrapper (2.5rem, no extra width cap) */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          y: contentY,
          scale: contentScale,
          width: "100%",
          padding: "0 var(--gutter)",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-coral)",
            marginBottom: "var(--space-16)",
          }}
        >
          {data.num} — Services
        </p>
        <h2
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            margin: "0 0 var(--space-20)",
            color: "#fff",
          }}
        >
          {data.heading}
        </h2>
        <p
          style={{
            fontSize: "clamp(1.1rem, 2.4vw, 1.9rem)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            margin: "0 0 var(--space-40)",
            maxWidth: "560px",
            lineHeight: 1.3,
          }}
        >
          {data.statement}
        </p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-16)", maxWidth: "560px" }}>
          {data.items.map((item, i) => (
            <ServiceItem key={item} progress={progress} range={itemRange(seg, i)} label={item} reduced={reduced} />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

// ─── CTA panel — the final pinned slide ─────────────────────────────────────
// Fades in right after Video clears and then HOLDS at full opacity — no
// fade-out. It reaches 100% at CTA_IN[1] (just before progress 1), sits there
// as a brief static beat, then stays fully painted while the sticky container
// unpins and scrolls it up into the footer. Purely scroll-progress-driven, so
// scrolling back up reverses it exactly.

function CtaPanel({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  // Function-form transforms (not [input]→[output] ranges): they compute a
  // manually-clamped 0→1 progress `t` across CTA_IN and hold the end value for
  // all progress beyond it. This is deliberate — a plain range transform does
  // NOT reliably clamp to its final value past the last keyframe in this
  // scroll setup, which would let the CTA drop back toward 0 opacity during
  // the post-pin coast. The end value must hold so the CTA stays fully visible
  // as it scrolls into the footer.
  const t = (p: number) => Math.min(1, Math.max(0, (p - CTA_IN[0]) / (CTA_IN[1] - CTA_IN[0])));
  const opacity = useTransform(progress, (p) => t(p));
  const y = useTransform(progress, (p) => (reduced ? 0 : 40 * (1 - t(p))));
  const scale = useTransform(progress, (p) => (reduced ? 1 : 0.96 + 0.04 * t(p)));
  // Visible from the moment it begins fading in, and never gated off again —
  // it must stay painted through the post-release coast into the footer.
  const visibility = useTransform(progress, (p) => (p >= CTA_IN[0] ? "visible" : "hidden"));

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        visibility,
        y,
        scale,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 var(--gutter)",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          margin: "0 0 var(--space-20)",
        }}
      >
        Tell me your vision...
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "clamp(0.95rem, 1.35vw, 1.12rem)",
          maxWidth: "480px",
          lineHeight: 1.7,
          margin: "0 0 var(--space-36)",
        }}
      >
        Whether you need a single service or a complete creative package, every project is
        approached with the same attention to detail and commitment to quality.
      </p>
      <ConnectLink
        className="btn-gold"
        style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
      >
        Let&apos;s Create
      </ConnectLink>
    </motion.div>
  );
}

// ─── Intro panel ────────────────────────────────────────────────────────────

function IntroPanel({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const [, end] = INTRO;
  // Use the exact 2-point [0, end] input shape as y/scale below — that form
  // clamps reliably here, whereas ranges not anchored at 0 leave the intro
  // faintly visible through later chapters.
  const opacity = useTransform(progress, [0, end], [1, 0]);
  const y = useTransform(progress, [0, end], reduced ? [0, 0] : [0, -40]);
  const scale = useTransform(progress, [0, end], reduced ? [1, 1] : [1, 0.96]);
  const cueOpacity = useTransform(progress, [0, end * 0.6], [1, 0]);
  // Hard gate: fully remove from the compositor once past the intro window,
  // so it can never bleed through a later chapter.
  const visibility = useTransform(progress, (p) => (p < end ? "visible" : "hidden"));

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        visibility,
        y,
        scale,
      }}
    >
      {/* Section label — top-left, matching every other page's header position
          and using the plain .section-label styling (no size/spacing overrides) */}
      <p
        className="section-label"
        style={{
          position: "absolute",
          // Mirrors the page content wrapper's padding so the label lines up
          // with every other page's header (top = --space-56, left = --space-40).
          top: "var(--space-56)",
          left: "var(--gutter)",
        }}
      >
        Services
      </p>

      {/* Title + subtext — centered on screen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 var(--gutter)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.6rem, 6.4vw, 5.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 var(--space-28)",
            maxWidth: "15ch",
          }}
        >
          Everything your brand needs to be seen
        </h1>
        <p
          style={{
            fontSize: "clamp(0.95rem, 1.35vw, 1.12rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
            maxWidth: "540px",
            margin: 0,
          }}
        >
          From visual identity to photography and video production, Studio Sibley helps your business
          create a cohesive brand experience wherever your audience finds you.
        </p>
      </div>

      {/* Refined scroll cue — a thin rail with a travelling accent */}
      <motion.div
        style={{
          opacity: cueOpacity,
          position: "absolute",
          bottom: "3.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-16)",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Scroll to explore
        </span>
        <div style={{ position: "relative", width: "1px", height: "56px", background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
          <motion.div
            animate={reduced ? undefined : { y: ["-100%", "220%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1px",
              height: "22px",
              background: "linear-gradient(to bottom, transparent, var(--color-coral))",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile stacked fallback ────────────────────────────────────────────────

function MobileChapter({ data }: { data: Chapter }) {
  return (
    <div style={{ padding: "var(--space-56) 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-coral)", marginBottom: "var(--space-12)" }}>
        {data.num} — {data.label}
      </p>
      <h2 style={{ fontSize: "clamp(2.6rem, 15vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95, margin: "0 0 var(--space-12)" }}>
        {data.heading}
      </h2>
      <p style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", fontStyle: "italic", color: "rgba(255,255,255,0.7)", margin: "0 0 var(--space-28)", lineHeight: 1.35 }}>
        {data.statement}
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
        {data.items.map((item) => (
          <li
            key={item}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-12)", fontSize: "clamp(1rem, 1.3vw, 1.2rem)", fontWeight: 500, color: "rgba(255,255,255,0.9)" }}
          >
            <span style={{ width: "22px", height: "1.5px", background: "var(--color-coral)", flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ServicesClient({ bgUrl }: { bgUrl?: string }) {
  const reduced = !!useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const railOpacity = useTransform(scrollYProgress, [INTRO[1] * 0.7, INTRO[1] + 0.02], [0, 1]);
  const bg = bgUrl ? `url(${bgUrl})` : "url(/backgrounds/services.png)";

  return (
    <section style={{ paddingTop: "var(--nav-offset)", position: "relative", background: "var(--color-bg)" }}>
      {/* ── Desktop: sticky scroll sequence — CSS hides this on mobile ── */}
      <div className="services-sticky-desktop">
        <div ref={trackRef} style={{ position: "relative", height: "400vh" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
              {/* Background + legibility overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: bg,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,22,42,0.82), rgba(0,22,42,0.9))" }} />

              {/* Panels — intro, the three chapters, then the CTA as the
                  final pinned slide */}
              <IntroPanel progress={scrollYProgress} reduced={reduced} />
              {chapters.map((c) => (
                <ChapterPanel key={c.key} data={c} seg={SEGMENTS[c.key]} progress={scrollYProgress} reduced={reduced} />
              ))}
              <CtaPanel progress={scrollYProgress} reduced={reduced} />

              {/* Progress rail */}
              <motion.div
                style={{
                  opacity: railOpacity,
                  position: "absolute",
                  right: "max(2rem, 4vw)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-20)",
                  zIndex: 3,
                }}
              >
                {chapters.map((c) => (
                  <RailItem key={c.key} progress={scrollYProgress} seg={SEGMENTS[c.key]} label={c.label} num={c.num} reduced={reduced} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

      {/* ── Stacked chapters — desktop-only sticky sequence above is CSS-hidden
          on mobile; this is the mobile layout, CSS-hidden on desktop ── */}
      <div
        className="services-stacked-mobile"
        style={{ backgroundImage: bg, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div style={{ background: "linear-gradient(180deg, rgba(0,22,42,0.85), rgba(0,22,42,0.94))" }}>
          <div className="mobile-content" style={{ padding: "var(--space-56) var(--gutter) var(--space-16)" }}>
            <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>Services</p>
            <h1 style={{ fontSize: "clamp(1.9rem, 8vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--space-16)", maxWidth: "14ch" }}>
              Everything your brand needs to be seen
            </h1>
            <p style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, maxWidth: "460px", marginBottom: "var(--space-56)" }}>
              From visual identity to photography and video production, Studio Sibley helps your business
              create a cohesive brand experience wherever your audience finds you.
            </p>
            {chapters.map((c) => (
              <MobileChapter key={c.key} data={c} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA — mobile only; on desktop it's the sticky sequence's final
          pinned slide (CtaPanel) instead ── */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease }}
        className="mobile-content services-cta-mobile-only"
        style={{
          padding: "var(--space-112) var(--gutter)",
          position: "relative",
          zIndex: 1,
          background: "var(--color-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 var(--space-16)",
            lineHeight: 1.05,
          }}
        >
          Tell me your vision...
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.95rem",
            maxWidth: "480px",
            lineHeight: 1.65,
            margin: "0 0 var(--space-36)",
          }}
        >
          Whether you need a single service or a complete creative package, every project is
          approached with the same attention to detail and commitment to quality.
        </p>
        <ConnectLink
          className="btn-gold"
          style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Let&apos;s Create
        </ConnectLink>
      </motion.div>
    </section>
  );
}
