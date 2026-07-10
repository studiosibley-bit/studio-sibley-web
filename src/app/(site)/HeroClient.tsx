"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

export type HeroProject = {
  slug: string;
  title: string;
  imgUrl: string;
};

// ─── Auto-rotating, swipeable featured-work strip ───────────────────────────
// Shows 3 featured projects at full content width and, when there are more than
// 3, SLIDES to the next 3 every few seconds. Also drag/swipe-able for manual
// paging (auto-advance resumes with a fresh timer after each change). Reduced-
// motion users get no auto-rotation and an opacity-only transition; swipe still
// works. `initial={false}` keeps the first set from animating in on page load.

const STRIP_PER_VIEW = 3;
const STRIP_INTERVAL_MS = 4500;
const SWIPE_THRESHOLD = 60; // px of horizontal drag to trigger a page change

function FeaturedStrip({ projects, reduced }: { projects: HeroProject[]; reduced: boolean }) {
  const n = projects.length;
  const canPage = n > STRIP_PER_VIEW;
  const [[start, direction], setState] = useState<[number, number]>([0, 0]);
  const draggingRef = useRef(false);
  const swipedAtRef = useRef(0);

  const paginate = useCallback(
    (dir: number) => setState(([s]) => [(((s + dir * STRIP_PER_VIEW) % n) + n) % n, dir]),
    [n],
  );

  // Auto-advance. Depends on `start`, so it restarts after every change —
  // including a manual swipe — giving a fresh interval each time.
  useEffect(() => {
    if (reduced || !canPage) return;
    const id = setInterval(() => {
      if (!draggingRef.current) paginate(1);
    }, STRIP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, canPage, start, paginate]);

  const visible = Array.from({ length: Math.min(STRIP_PER_VIEW, n) }, (_, i) => projects[(start + i) % n]);

  const slide = !reduced;
  const variants = {
    enter: (dir: number) => ({ x: slide ? (dir >= 0 ? "100%" : "-100%") : "0%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (dir: number) => ({ x: slide ? (dir >= 0 ? "-100%" : "100%") : "0%", opacity: 0 }),
  };

  function onDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    draggingRef.current = false;
    if (Math.abs(info.offset.x) > 4) swipedAtRef.current = Date.now();
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -450) paginate(1);
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 450) paginate(-1);
  }

  return (
    <div
      style={{ width: "100%", marginTop: "3rem", display: "grid", overflow: "hidden", borderRadius: "12px" }}
      // Suppress the click that follows a swipe so it doesn't open a project.
      onClickCapture={(e) => {
        if (Date.now() - swipedAtRef.current < 250) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={start}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 260, damping: 30 }, opacity: { duration: 0.25 } }}
          drag={canPage ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onDragStart={() => { draggingRef.current = true; }}
          onDragEnd={onDragEnd}
          style={{
            gridArea: "1 / 1",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.9rem",
            cursor: canPage ? "grab" : "default",
            touchAction: canPage ? "pan-y" : "auto",
          }}
        >
          {visible.map((p, i) => (
            <Link
              key={`${p.slug}-${i}`}
              href={`/projects/${p.slug}`}
              className="group"
              draggable={false}
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#111",
              }}
            >
              <Image
                src={p.imgUrl}
                alt={p.title}
                fill
                quality={82}
                loading="eager"
                draggable={false}
                sizes="(max-width: 768px) 33vw, 30vw"
                style={{ objectFit: "cover", pointerEvents: "none" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)", padding: "0.75rem 0.85rem", pointerEvents: "none" }}
              >
                <p style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroClient({
  testimonials,
  bgUrl,
  showTestimonials = false,
  heroProjects = [],
}: {
  testimonials: Testimonial[];
  bgUrl?: string;
  showTestimonials?: boolean;
  heroProjects?: HeroProject[];
}) {
  const reduced = useReducedMotion();

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
        <h1
          style={{
            fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 1.5rem",
            color: "#fff",
          }}
        >
          What It Looks<br />
          Like{" "}
          <span style={{
            background: "linear-gradient(90deg, var(--color-gold), var(--color-coral))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Matters</span>
        </h1>

        <p
          style={{
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.65,
            maxWidth: "420px",
            marginBottom: "2.5rem",
          }}
        >
          Design, photo, and video for anyone with a story worth telling.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "4rem" }}>
          <Link href="/projects" className="btn-gold" style={{ padding: "0.75rem 1.8rem", fontSize: "0.9rem", fontWeight: 700 }}>
            View Work
          </Link>
          <Link href="/connect" className="btn-outline-light" style={{ padding: "0.75rem 1.8rem", fontSize: "0.9rem" }}>
            Contact
          </Link>
        </div>

        {heroProjects.length > 0 && <FeaturedStrip projects={heroProjects} reduced={!!reduced} />}

        {showTestimonials && (
          <div
            className="testimonials-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}
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
          </div>
        )}
      </div>
    </section>
  );
}
