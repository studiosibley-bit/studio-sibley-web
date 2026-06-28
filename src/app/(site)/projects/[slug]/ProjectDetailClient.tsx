"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ease, staggerContainer, staggerItem } from "@/lib/motion";

type GalleryImage = { url: string; width: number; height: number };

type Project = {
  _id: string;
  title: string;
  slug: string;
  medium: string;
  category: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  galleryImages: GalleryImage[];
};

// ─── YouTube ─────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "1rem", overflow: "hidden", background: "#000" }}>
        {playing ? (
          <iframe
            src={embedUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <>
            <Image src={thumbUrl} alt="Video thumbnail" fill style={{ objectFit: "cover" }} sizes="100vw" />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid #fff", marginLeft: 4 }} />
              </motion.div>
            </button>
          </>
        )}
      </div>
      <div style={{ marginTop: "0.6rem", textAlign: "right" }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)")}
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
}

// ─── Zoom / pan engine ───────────────────────────────────────────────────────

function ZoomableImage({
  src, width, height, alt, zoomEnabled,
}: GalleryImage & { alt: string; zoomEnabled: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const zoomRef = useRef(zoomEnabled);
  zoomRef.current = zoomEnabled;

  function clamp(panX: number, panY: number, s: number) {
    const c = containerRef.current;
    if (!c) return { x: panX, y: panY };
    const { width: cw, height: ch } = c.getBoundingClientRect();
    const imgAR = width / height;
    const contAR = cw / ch;
    const iw = imgAR > contAR ? cw : ch * imgAR;
    const ih = imgAR > contAR ? cw / imgAR : ch;
    const maxX = Math.max(0, (iw * s - cw) / 2);
    const maxY = Math.max(0, (ih * s - ch) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, panX)),
      y: Math.max(-maxY, Math.min(maxY, panY)),
    };
  }

  const applyZoom = useCallback((newScale: number, cx: number, cy: number) => {
    const sc = Math.min(5, Math.max(1, newScale));
    const ratio = sc / scaleRef.current;
    let nx = cx + (panRef.current.x - cx) * ratio;
    let ny = cy + (panRef.current.y - cy) * ratio;
    if (sc <= 1) { nx = 0; ny = 0; }
    else { const c = clamp(nx, ny, sc); nx = c.x; ny = c.y; }
    scaleRef.current = sc;
    panRef.current = { x: nx, y: ny };
    setScale(sc);
    setPan({ x: nx, y: ny });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (!zoomRef.current) return;
      e.preventDefault();
      const r = el!.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      applyZoom(scaleRef.current * (e.deltaY < 0 ? 1.15 : 1 / 1.15), cx, cy);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  // Reset when zoom toggled off
  useEffect(() => {
    if (!zoomEnabled) {
      scaleRef.current = 1; panRef.current = { x: 0, y: 0 };
      setScale(1); setPan({ x: 0, y: 0 });
    }
  }, [zoomEnabled]);

  function onPointerDown(e: React.PointerEvent) {
    if (!zoomRef.current || scaleRef.current <= 1) return;
    e.preventDefault();
    setDragging(true);
    dragOrigin.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const p = clamp(
      dragOrigin.current.panX + (e.clientX - dragOrigin.current.x),
      dragOrigin.current.panY + (e.clientY - dragOrigin.current.y),
      scaleRef.current,
    );
    panRef.current = p;
    setPan(p);
  }
  function onPointerUp() { setDragging(false); }

  function onDoubleClick() {
    scaleRef.current = 1; panRef.current = { x: 0, y: 0 };
    setScale(1); setPan({ x: 0, y: 0 });
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!zoomRef.current || e.touches.length !== 2 || lastTouchDist.current === null) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.hypot(dx, dy);
    const r = containerRef.current!.getBoundingClientRect();
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left - r.width / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top - r.height / 2;
    applyZoom(scaleRef.current * (dist / lastTouchDist.current), midX, midY);
    lastTouchDist.current = dist;
  }
  function onTouchEnd() { lastTouchDist.current = null; }

  const cursor = !zoomEnabled ? "default" : scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in";

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: dragging ? "none" : "transform 0.06s ease-out",
          willChange: "transform",
          userSelect: "none",
        }}
      >
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          quality={95}
          priority
          draggable={false}
          style={{
            maxWidth: "100%", maxHeight: "100%",
            width: "auto", height: "auto",
            display: "block",
            pointerEvents: "none", userSelect: "none",
          }}
        />
      </div>
    </div>
  );
}

// ─── Spotlight overlay ────────────────────────────────────────────────────────

function Spotlight({
  images, initialIndex, title, description, onClose,
}: {
  images: GalleryImage[];
  initialIndex: number;
  title: string;
  description?: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [imgKey, setImgKey] = useState(0);

  function go(i: number) {
    setIndex(i);
    setZoomEnabled(false);
    setImgKey((k) => k + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < images.length - 1) go(index + 1);
      if (e.key === "ArrowLeft" && index > 0) go(index - 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  const img = images[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.96)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "1.5rem",
        padding: "1.1rem 1.4rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: 0, lineHeight: 1.25 }}>
            {title}
          </p>
          {description && (
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", margin: "0.3rem 0 0", lineHeight: 1.6, maxWidth: "60ch" }}>
              {description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0, paddingTop: "0.1rem" }}>
          {images.length > 1 && (
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)" }}>
              {index + 1} / {images.length}
            </span>
          )}

          {/* Zoom toggle */}
          <button
            onClick={() => setZoomEnabled((v) => !v)}
            title={zoomEnabled ? "Exit zoom" : "Zoom to inspect"}
            style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              padding: "0.35rem 0.7rem", borderRadius: "7px",
              border: `1px solid ${zoomEnabled ? "rgba(255,212,148,0.45)" : "rgba(255,255,255,0.14)"}`,
              background: zoomEnabled ? "rgba(255,212,148,0.1)" : "rgba(255,255,255,0.06)",
              color: zoomEnabled ? "var(--color-gold)" : "rgba(255,255,255,0.55)",
              fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.18s",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              {zoomEnabled ? <path d="M8 11h6M11 8v6" /> : <path d="M8 11h6" />}
            </svg>
            {zoomEnabled ? "Zoom on" : "Zoom"}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff", fontSize: "0.9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit", flexShrink: 0, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)")}
          >✕</button>
        </div>
      </div>

      {/* Image area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableImage
              key={imgKey}
              src={img.url}
              width={img.width}
              height={img.height}
              alt={`${title} ${index + 1}`}
              zoomEnabled={zoomEnabled}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <AnimatePresence>
          {zoomEnabled && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute", bottom: "1rem", left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)", pointerEvents: "none",
                whiteSpace: "nowrap", margin: 0,
              }}
            >
              Scroll to zoom · Drag to pan · Double-click to reset
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            {index > 0 && (
              <button
                onClick={() => go(index - 1)}
                style={{
                  position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
                  width: 44, height: 44, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.14)", background: "rgba(0,0,0,0.5)",
                  color: "#fff", fontSize: "1.4rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "inherit", zIndex: 10, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)")}
              >‹</button>
            )}
            {index < images.length - 1 && (
              <button
                onClick={() => go(index + 1)}
                style={{
                  position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                  width: 44, height: 44, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.14)", background: "rgba(0,0,0,0.5)",
                  color: "#fff", fontSize: "1.4rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "inherit", zIndex: 10, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)")}
              >›</button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Gallery tile ─────────────────────────────────────────────────────────────

function GalleryTile({ img, index, onClick, reduced }: {
  img: GalleryImage; index: number; onClick: () => void; reduced: boolean;
}) {
  return (
    <motion.button
      variants={staggerItem}
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onClick}
      style={{
        position: "relative", background: "var(--color-surface)",
        border: "1px solid rgba(51,65,85,0.5)", borderRadius: "1rem",
        overflow: "hidden", cursor: "pointer", aspectRatio: "4/3",
        display: "block", padding: 0, outline: "none", width: "100%",
      }}
    >
      <Image
        src={img.url}
        alt={`Image ${index + 1}`}
        fill
        quality={90}
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
        }}
      >
        <p style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em" }}>VIEW</p>
      </motion.div>
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailClient({ project }: { project: Project }) {
  const searchParams = useSearchParams();
  const fromMedium = searchParams.get("medium");
  const fromCat = searchParams.get("cat");
  const backHref = fromMedium
    ? `/projects?medium=${fromMedium}${fromCat ? `&cat=${fromCat}` : ""}`
    : "/projects";

  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const isVideo = project.medium === "Video";
  const hasGallery = project.galleryImages.length > 0;

  const thumbImage: GalleryImage | null = project.thumbnailUrl
    ? { url: project.thumbnailUrl, width: project.thumbnailWidth ?? 1800, height: project.thumbnailHeight ?? 1200 }
    : null;

  const showFeaturedImage = !!thumbImage && (!isVideo || !project.videoUrl);

  // Spotlight array: thumbnail first, then gallery images
  const spotlightImages: GalleryImage[] = [
    ...(showFeaturedImage ? [thumbImage!] : []),
    ...project.galleryImages,
  ];
  const galleryOffset = showFeaturedImage ? 1 : 0;

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 18 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay, ease },
    };
  }

  return (
    <>
      <section style={{ paddingTop: "68px", minHeight: "100vh", background: "var(--color-bg)" }}>
        <div style={{ padding: "2rem 2.5rem 4rem", position: "relative", zIndex: 1 }}>

          <motion.div {...fu(0)}>
            <Link
              href={backHref}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                marginBottom: "2rem", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
            >
              ← Projects
            </Link>
          </motion.div>

          <motion.h1
            {...fu(0.08)}
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 0.5rem" }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            {...fu(0.15)}
            style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-coral)", marginBottom: project.description ? "1.25rem" : "1.75rem" }}
          >
            {project.medium} — {project.category}
          </motion.p>

          {project.description && (
            <motion.p
              {...fu(0.22)}
              style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "600px", marginBottom: "1.75rem" }}
            >
              {project.description}
            </motion.p>
          )}

          {/* Video */}
          {isVideo && project.videoUrl && (
            <motion.div {...fu(0.3)}>
              <VideoPlayer url={project.videoUrl} />
            </motion.div>
          )}

          {/* Featured image — native aspect ratio, no crop */}
          {showFeaturedImage && (
            <motion.div
              {...fu(project.description ? 0.3 : 0.22)}
              onClick={() => setSpotlightIndex(0)}
              style={{
                cursor: "pointer",
                borderRadius: "1rem",
                overflow: "hidden",
                marginBottom: hasGallery ? "1.25rem" : 0,
                width: "100%",
              }}
            >
              <div style={{ position: "relative", width: "100%" }}>
                <Image
                  src={thumbImage.url}
                  alt={project.title}
                  width={thumbImage.width}
                  height={thumbImage.height}
                  quality={90}
                  priority
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "1rem" }}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)",
                    borderRadius: "1rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <p style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em" }}>VIEW</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Gallery grid */}
          {hasGallery && (
            <motion.div
              variants={reduced ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}
            >
              {project.galleryImages.map((img, i) => (
                <GalleryTile
                  key={i}
                  img={img}
                  index={i}
                  onClick={() => setSpotlightIndex(galleryOffset + i)}
                  reduced={!!reduced}
                />
              ))}
            </motion.div>
          )}

          {!isVideo && !thumbImage && !hasGallery && (
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              No images added yet
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {spotlightIndex !== null && spotlightImages.length > 0 && (
          <Spotlight
            images={spotlightImages}
            initialIndex={spotlightIndex}
            title={project.title}
            description={project.description}
            onClose={() => setSpotlightIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
