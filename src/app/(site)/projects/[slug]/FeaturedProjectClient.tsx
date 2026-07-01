"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";
import { type GalleryImage } from "@/components/Spotlight";
import BookletViewer from "@/components/BookletViewer";
import { armScrollRestore } from "@/components/PageTransition";

type Project = {
  _id: string;
  title: string;
  slug: string;
  medium: string;
  category: string;
  brief?: string;
  role?: string[];
  year?: number;
  videoUrl?: string;
  heroVideoUrl?: string;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  galleryImages: GalleryImage[];
  isBooklet?: boolean;
  bookletPages: GalleryImage[];
};

// ─── YouTube player ───────────────────────────────────────────────────────────

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
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", lineHeight: 0 }}>
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
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
          <button
            onClick={() => setPlaying(true)}
            aria-label="Play video"
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FeaturedProjectClient({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const isVideo = project.medium === "Video" && !!project.videoUrl;
  const roles = Array.isArray(project.role) ? project.role : project.role ? [project.role] : [];

  const thumbImage: GalleryImage | null = project.thumbnailUrl
    ? { url: project.thumbnailUrl, width: project.thumbnailWidth ?? 1800, height: project.thumbnailHeight ?? 1200 }
    : null;

  const hasBooklet = !!project.isBooklet && project.bookletPages.length > 0;
  const contentImages: GalleryImage[] = hasBooklet ? [] : project.galleryImages;

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay, ease },
    };
  }

  return (
    <div style={{ background: "#0a0a0a", paddingTop: "68px" }}>

      {/* Fixed back button */}
        <div style={{ position: "fixed", top: "84px", left: "2rem", zIndex: 200 }}>
          <Link
            href="/projects"
            scroll={false}
            onNavigate={() => armScrollRestore("/projects")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              color: "rgba(255,255,255,0.55)", fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
              transition: "color 0.2s",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "0.45rem 0.85rem", borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
          >
            ← Projects
          </Link>
        </div>

        {/* Banner — blurred thumbnail (or hero video) behind title text */}
        <div
          className="featured-banner"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "7rem 3rem 4rem",
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          {/* Background: hero video MP4 takes priority, otherwise thumbnail */}
          {project.heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={project.heroVideoUrl} type="video/mp4" />
            </video>
          ) : thumbImage ? (
            <Image
              src={thumbImage.url}
              alt=""
              fill
              quality={60}
              priority
              style={{
                objectFit: "cover",
                filter: "blur(28px)",
                transform: "scale(1.12)",
              }}
              sizes="100vw"
            />
          ) : null}

          {/* Dark gradient for text readability */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.1) 100%)",
          }} />

          {/* Text */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.p
              {...fu(0)}
              style={{
                fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
                marginBottom: "1.25rem",
              }}
            >
              {[project.medium, project.category, project.year].filter(Boolean).join(" · ")}
            </motion.p>

            <motion.h1
              {...fu(0.1)}
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6rem)", fontWeight: 800,
                letterSpacing: "-0.03em", lineHeight: 1.0,
                color: "#fff", margin: "0 0 2rem",
              }}
            >
              {project.title}
            </motion.h1>

            <div className="featured-meta" style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
              {roles.length > 0 && (
                <motion.div {...fu(0.2)}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.35rem" }}>
                    {roles.length === 1 ? "Role" : "Roles"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    {roles.map((r, i) => (
                      <p key={i} style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", fontWeight: 500, margin: 0 }}>
                        {r}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
              {project.brief && (
                <motion.div {...fu(0.25)} style={{ flex: "1 1 320px", minWidth: 0 }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.35rem" }}>
                    Brief
                  </p>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontWeight: 400, whiteSpace: "pre-wrap" }}>
                    {project.brief}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Content: YouTube first for video projects */}
        {isVideo && project.videoUrl && (
          <VideoPlayer url={project.videoUrl} />
        )}

        {/* Booklet page-flip viewer */}
        {hasBooklet && (
          <div className="booklet-wrapper" style={{ padding: "3rem 2rem" }}>
            <BookletViewer pages={project.bookletPages} title={project.title} />
          </div>
        )}

        {/* Full-bleed images */}
        {contentImages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {contentImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.05 + i * 0.04, ease }}
                style={{ width: "100%", lineHeight: 0 }}
              >
                <Image
                  src={img.url}
                  alt={`${project.title} — ${i + 1}`}
                  width={img.width}
                  height={img.height}
                  quality={95}
                  loading="eager"
                  style={{ width: "100%", height: "auto", display: "block" }}
                  sizes="100vw"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ padding: "1.75rem 3rem" }}>
          <Link
            href="/projects"
            scroll={false}
            onNavigate={() => armScrollRestore("/projects")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
          >
            ← Back to Projects
          </Link>
        </div>
    </div>
  );
}
