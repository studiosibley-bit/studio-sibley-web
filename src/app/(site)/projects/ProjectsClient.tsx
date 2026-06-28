"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import { ease, staggerContainer, staggerItem, reducedStaggerItem } from "@/lib/motion";

type Medium = "Photo" | "Video" | "Design";

const MEDIUMS: Medium[] = ["Photo", "Video", "Design"];

const categories: Record<Medium, string[]> = {
  Photo: ["People", "Products", "Places"],
  Video: ["Stories", "Campaigns", "Events"],
  Design: ["Identity", "Print", "Digital"],
};

const defaultActive: Record<Medium, string> = {
  Photo: "All",
  Video: "All",
  Design: "All",
};

const TWO_PI_OVER_3 = (2 * Math.PI) / 3;
const WHEEL_AMP = 26; // px amplitude — vertical spacing between items

type Project = {
  _id: string;
  title: string;
  slug: string;
  medium: Medium;
  category: string;
  thumbnail?: { asset: { _ref: string } };
  description?: string;
};

// ─── Wheel item ──────────────────────────────────────────────────────────────

function WheelItem({
  label,
  index,
  rotation,
  isActive,
  onClick,
  reduced,
}: {
  label: string;
  index: number;
  rotation: MotionValue<number>;
  isActive: boolean;
  onClick: () => void;
  reduced: boolean;
}) {
  const y = useTransform(rotation, (r) =>
    Math.sin((index - r) * TWO_PI_OVER_3) * WHEEL_AMP
  );

  const scale = useTransform(rotation, (r) => {
    if (reduced) return 1;
    const cos = Math.cos((index - r) * TWO_PI_OVER_3);
    return 0.68 + 0.32 * Math.max(0, cos);
  });

  const opacity = useTransform(rotation, (r) => {
    const cos = Math.cos((index - r) * TWO_PI_OVER_3);
    return Math.min(1, Math.max(0, cos * 0.45 + 0.6));
  });

  const filter = useTransform(rotation, (r) => {
    if (reduced) return "blur(0px)";
    const cos = Math.cos((index - r) * TWO_PI_OVER_3);
    const amt = Math.max(0, (1 - cos) * 0.65);
    return `blur(${amt.toFixed(2)}px)`;
  });

  return (
    <motion.button
      style={{
        position: "absolute",
        y,
        scale,
        opacity,
        filter,
        background: "none",
        border: "none",
        cursor: isActive ? "default" : "pointer",
        fontFamily: "inherit",
        fontWeight: 800,
        fontSize: "1.15rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#fff",
        padding: "0.35rem 0.75rem",
        userSelect: "none",
        whiteSpace: "nowrap",
        outline: "none",
      }}
      onClick={!isActive ? onClick : undefined}
      whileTap={!isActive && !reduced ? { scale: 0.93 } : undefined}
    >
      {label}
    </motion.button>
  );
}

// ─── Wheel container ─────────────────────────────────────────────────────────

function MediumWheel({
  activeMedium,
  onChange,
  reduced,
}: {
  activeMedium: Medium;
  onChange: (m: Medium) => void;
  reduced: boolean;
}) {
  const activeIndex = MEDIUMS.indexOf(activeMedium);
  const rotation = useMotionValue(activeIndex);

  function handleClick(targetIndex: number) {
    const r = rotation.get();
    const rRound = Math.round(r);
    // Find nearest integer rotation that lands on targetIndex (mod 3)
    const base = rRound - (((rRound % 3) + 3) % 3);
    const candidates = [base + targetIndex - 3, base + targetIndex, base + targetIndex + 3];
    const target = candidates.reduce((a, b) =>
      Math.abs(a - rRound) < Math.abs(b - rRound) ? a : b
    );
    animate(rotation, target, { duration: 0.42, ease: [0.22, 1, 0.36, 1] });
    onChange(MEDIUMS[targetIndex]);
  }

  return (
    <div
      style={{
        position: "relative",
        height: 58,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      {/* Items */}
      {MEDIUMS.map((m, i) => (
        <WheelItem
          key={m}
          label={m}
          index={i}
          rotation={rotation}
          isActive={i === activeIndex}
          onClick={() => handleClick(i)}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

// ─── Project tiles ────────────────────────────────────────────────────────────

function PlaceholderTile() {
  return (
    <motion.div
      variants={staggerItem}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "3/2",
      }}
    >
      <p style={{ color: "rgba(0,0,0,0.2)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Coming Soon
      </p>
    </motion.div>
  );
}

function ProjectTile({ project, href, reduced }: { project: Project; href: string; reduced: boolean }) {
  const imgUrl = project.thumbnail
    ? urlFor(project.thumbnail).width(1200).height(800).fit("crop").url()
    : null;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ borderRadius: "14px" }}
    >
      <Link
        href={href}
        className="group"
        style={{
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          background: "rgba(255,255,255,0.88)",
          display: "block",
          aspectRatio: "3/2",
        }}
      >
        {imgUrl ? (
          <Image src={imgUrl} alt={project.title} fill quality={90} style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 33vw" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "rgba(0,0,0,0.2)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {project.title}
            </p>
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 2 }}
        >
          <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{project.title}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjectsClient({ projects, bgUrl }: { projects: Project[]; bgUrl?: string }) {
  const searchParams = useSearchParams();
  const paramMedium = searchParams.get("medium") as Medium | null;
  const paramCat = searchParams.get("cat");
  const initialMedium: Medium = paramMedium && MEDIUMS.includes(paramMedium) ? paramMedium : "Photo";
  const initialCategory = paramCat && (paramCat === "All" || categories[initialMedium].includes(paramCat)) ? paramCat : defaultActive[initialMedium];

  const [activeMedium, setActiveMedium] = useState<Medium>(initialMedium);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const reduced = useReducedMotion();

  function switchMedium(m: Medium) {
    setActiveMedium(m);
    setActiveCategory(defaultActive[m]);
  }

  const filteredProjects = projects.filter((p) => p.medium === activeMedium);
  const displayProjects = activeCategory === "All"
    ? filteredProjects
    : filteredProjects.filter((p) => p.category === activeCategory);

  const PLACEHOLDER_COUNT = 8;
  const hasProjects = projects.some((p) => p.medium === activeMedium);
  const placeholderCount = hasProjects ? 0 : PLACEHOLDER_COUNT;

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
      <div style={{ padding: "3.5rem 2.5rem 4rem", flex: 1, position: "relative", zIndex: 10 }}>
        <motion.p
          className="section-label"
          style={{ marginBottom: "1.25rem" }}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          Projects
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: "1rem", alignItems: "start" }}>

          {/* Tile grid — fades on medium/category change; sidebar is separate */}
          <AnimatePresence mode="wait">
            {displayProjects.length === 0 && placeholderCount === 0 ? (
              <motion.div
                key={`empty-${activeMedium}-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "2/1", color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                No projects in this category yet
              </motion.div>
            ) : (
              <motion.div
                key={`${activeMedium}-${activeCategory}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}
              >
                {displayProjects.map((p) => (
                  <ProjectTile
                    key={p._id}
                    project={p}
                    href={`/projects/${p.slug}?medium=${activeMedium}&cat=${activeCategory}`}
                    reduced={!!reduced}
                  />
                ))}
                {Array.from({ length: placeholderCount }).map((_, i) => (
                  <PlaceholderTile key={`ph-${i}`} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

            {/* Sidebar — stays mounted, never fades */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", position: "sticky", top: "88px" }}>

              {/* 3D wheel */}
              <MediumWheel
                activeMedium={activeMedium}
                onChange={switchMedium}
                reduced={!!reduced}
              />

              {/* Category buttons */}
              <div style={{ background: "var(--color-mid)", borderRadius: "14px", padding: "0.65rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["All", ...categories[activeMedium]].map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      whileHover={!isActive && !reduced ? { scale: 1.02 } : undefined}
                      whileTap={!isActive ? { scale: 0.97 } : undefined}
                      transition={{ duration: 0.15 }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.9rem 1rem",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                        cursor: isActive ? "default" : "pointer",
                        border: "none",
                        borderRadius: "9999px",
                        fontFamily: "inherit",
                        textAlign: "center",
                        transition: "background 0.2s, color 0.2s",
                        background: isActive
                          ? "linear-gradient(90deg, var(--color-gold), var(--color-coral))"
                          : "rgba(0,0,0,0.28)",
                        color: isActive ? "#1a1200" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
