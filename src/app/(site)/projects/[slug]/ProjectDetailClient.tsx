"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Spotlight, type GalleryImage } from "@/components/Spotlight";
import BookletViewer from "@/components/BookletViewer";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { armScrollRestore } from "@/components/PageTransition";

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
  fullSizeImages: GalleryImage[];
  galleryImages: GalleryImage[];
  isBooklet?: boolean;
  bookletPages: GalleryImage[];
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
    <div style={{ marginBottom: "var(--space-20)" }}>
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
            <ImageWithPlaceholder src={thumbUrl} alt="Video thumbnail" fill style={{ objectFit: "cover" }} sizes="100vw" />
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
      <div style={{ marginTop: "var(--space-8)", textAlign: "right" }}>
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

// ─── Gallery tile ─────────────────────────────────────────────────────────────

function GalleryTile({ img, index, onClick, reduced }: {
  img: GalleryImage; index: number; onClick: () => void; reduced: boolean;
}) {
  return (
    <motion.button
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
      <ImageWithPlaceholder
        src={img.url}
        alt={`Image ${index + 1}`}
        fill
        quality={90}
        loading="eager"
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
  const hasBooklet = !!project.isBooklet && project.bookletPages.length > 0;
  const hasGallery = !hasBooklet && project.galleryImages.length > 0;
  const hasFullSize = !hasBooklet && project.fullSizeImages.length > 0;

  const thumbImage: GalleryImage | null = project.thumbnailUrl
    ? { url: project.thumbnailUrl, width: project.thumbnailWidth ?? 1800, height: project.thumbnailHeight ?? 1200 }
    : null;

  const showFeaturedImage = !!thumbImage && (!isVideo || !project.videoUrl) && !hasBooklet;

  const spotlightImages: GalleryImage[] = [
    ...(showFeaturedImage ? [thumbImage!] : []),
    ...project.fullSizeImages,
    ...project.galleryImages,
  ];
  const fullSizeOffset = showFeaturedImage ? 1 : 0;
  const galleryOffset = fullSizeOffset + project.fullSizeImages.length;

  return (
    <>
      <section style={{ paddingTop: "var(--nav-offset)", minHeight: "100vh", background: "var(--color-bg)" }}>
        <div className="mobile-content" style={{ padding: "var(--space-32) var(--space-40) var(--space-64)", position: "relative", zIndex: 1 }}>

          <div>
            <Link
              href={backHref}
              scroll={false}
              onNavigate={() => armScrollRestore("/projects")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-8)",
                color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                marginBottom: "var(--space-32)", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
            >
              ← Projects
            </Link>
          </div>

          <h1
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 var(--space-8)" }}
          >
            {project.title}
          </h1>

          <p
            style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-coral)", marginBottom: project.description ? "1.25rem" : "1.75rem" }}
          >
            {project.medium} — {project.category}
          </p>

          {project.description && (
            <p
              style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "600px", marginBottom: "var(--space-28)" }}
            >
              {project.description}
            </p>
          )}

          {isVideo && project.videoUrl && (
            <div>
              <VideoPlayer url={project.videoUrl} />
            </div>
          )}

          {showFeaturedImage && (
            <div
              style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", marginBottom: (hasFullSize || hasGallery || hasBooklet) ? "1.25rem" : 0, width: "100%" }}
            >
              <ImageWithPlaceholder
                src={thumbImage.url}
                alt={project.title}
                width={thumbImage.width}
                height={thumbImage.height}
                quality={90}
                loading="eager"
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "1rem" }}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          {hasBooklet && (
            <div style={{ marginBottom: "var(--space-20)" }}>
              <BookletViewer pages={project.bookletPages} title={project.title} />
            </div>
          )}

          {hasFullSize && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)", marginBottom: hasGallery ? "0.75rem" : 0 }}>
              {project.fullSizeImages.map((img, i) => (
                <div
                  key={i}
                  style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", width: "100%" }}
                >
                  <ImageWithPlaceholder
                    src={img.url}
                    alt={`${project.title} — ${i + 1}`}
                    width={img.width}
                    height={img.height}
                    quality={90}
                    loading="eager"
                    style={{ width: "100%", height: "auto", display: "block", borderRadius: "1rem" }}
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                </div>
              ))}
            </div>
          )}

          {hasGallery && (
            <div
              className="gallery-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-12)" }}
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
            </div>
          )}

          {!isVideo && !thumbImage && !hasFullSize && !hasGallery && !hasBooklet && (
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
