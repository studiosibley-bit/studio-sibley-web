"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import { ease, staggerContainer, staggerItem } from "@/lib/motion";

type TileSize = "full" | "half" | "third";

type Project = {
  _id: string;
  title: string;
  slug: string;
  medium: string;
  category: string;
  featured?: boolean;
  tileSize?: TileSize;
  role?: string[];
  year?: number;
  thumbnail?: { asset: { _ref: string }; dimensions?: { width: number; height: number } };
  description?: string;
};

function captureScroll() {
  sessionStorage.setItem("scrollY:/projects", String(window.scrollY));
}

// ─── Mosaic tile (featured) ───────────────────────────────────────────────────

const colSpan: Record<TileSize, number> = { full: 6, half: 3, third: 2 };
const tileAspect: Record<TileSize, string> = { full: "21/9", half: "3/2", third: "4/3" };

function FeaturedTile({ project, reduced }: { project: Project; reduced: boolean }) {
  const size: TileSize = project.tileSize ?? "half";
  const imgUrl = project.thumbnail
    ? urlFor(project.thumbnail).width(1600).url()
    : null;

  return (
    <motion.div
      variants={staggerItem}
      style={{
        gridColumn: `span ${colSpan[size]}`,
        position: "relative",
        aspectRatio: tileAspect[size],
        overflow: "hidden",
        borderRadius: "10px",
        background: "#111",
      }}
    >
      <Link href={`/projects/${project.slug}`} onClick={captureScroll} className="group" style={{ display: "block", width: "100%", height: "100%" }}>
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            quality={90}
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            sizes={size === "full" ? "100vw" : size === "half" ? "50vw" : "33vw"}
            className="group-hover:scale-[1.03]"
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.22 }}
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "1.5rem 1.75rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            {[project.medium, ...(Array.isArray(project.role) ? project.role : project.role ? [project.role] : []), project.year].filter(Boolean).join(" · ")}
          </p>
          <p style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {project.title}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Other work tile ──────────────────────────────────────────────────────────

function OtherTile({ project, reduced }: { project: Project; reduced: boolean }) {
  const imgUrl = project.thumbnail
    ? urlFor(project.thumbnail).width(900).url()
    : null;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ borderRadius: "10px", overflow: "hidden", background: "#111" }}
    >
      <Link href={`/projects/${project.slug}`} onClick={captureScroll} className="group" style={{ display: "block", position: "relative", aspectRatio: "3/2" }}>
        {imgUrl ? (
          <Image src={imgUrl} alt={project.title} fill quality={85} style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {project.title}
            </p>
          </div>
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
          style={{
            top: "0.85rem",
            zIndex: 1,
            pointerEvents: "none",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "9999px",
            padding: "0.3rem 0.75rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
            {project.medium}
          </p>
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.55)", zIndex: 2, padding: "1rem" }}
        >
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
            {project.medium}
          </p>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.82rem" }}>{project.title}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjectsClient({ projects, bgUrl }: { projects: Project[]; bgUrl?: string }) {
  const reduced = useReducedMotion();

  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay, ease },
    };
  }

  return (
    <section
      style={{
        paddingTop: "68px",
        minHeight: "100vh",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/projects.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ padding: "3.5rem 2.5rem 6rem", position: "relative", zIndex: 10 }}>

        {/* Featured section */}
        <motion.p className="section-label" style={{ marginBottom: "1.5rem" }} {...fu(0)}>
          Projects
        </motion.p>

        {featured.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.6rem",
              marginBottom: "5rem",
            }}
          >
            {featured.map((p) => (
              <FeaturedTile key={p._id} project={p} reduced={!!reduced} />
            ))}
          </motion.div>
        )}

        {/* See Other Work section */}
        {other.length > 0 && (
          <>
            <motion.div {...fu(0.1)} style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                See Other Work
              </p>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.6rem",
              }}
            >
              {other.map((p) => (
                <OtherTile key={p._id} project={p} reduced={!!reduced} />
              ))}
            </motion.div>
          </>
        )}

        {featured.length === 0 && other.length === 0 && (
          <motion.p {...fu(0.1)} style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            No projects yet
          </motion.p>
        )}
      </div>
    </section>
  );
}
