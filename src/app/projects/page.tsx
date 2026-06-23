"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoPattern from "@/components/LogoPattern";

type Medium = "Design" | "Photo" | "Video";

const categories: Record<Medium, string[]> = {
  Design: ["Identity", "Print", "Digital"],
  Photo: ["People", "Products", "Places"],
  Video: ["Stories", "Campaign", "Events"],
};

// Placeholder project tiles — replaced by Sanity data later
const placeholderProjects: Record<
  Medium,
  {
    title: string;
    category: string;
    featured?: boolean;
    color: string;
    slug: string;
  }[]
> = {
  Design: [
    { title: "Brand Identity — Meridian Co.", category: "Identity", featured: true, color: "#1D2733", slug: "meridian-brand" },
    { title: "Event Poster Series", category: "Print", color: "#1D2733", slug: "event-posters" },
    { title: "Digital Campaign", category: "Digital", color: "#1D2733", slug: "digital-campaign" },
    { title: "Logo System — Oak & Fig", category: "Identity", color: "#1D2733", slug: "oak-fig-logo" },
    { title: "Product Brochure", category: "Print", color: "#1D2733", slug: "product-brochure" },
  ],
  Photo: [
    { title: "Brand Photography — Apex", category: "People", featured: true, color: "#1D2733", slug: "apex-brand-photo" },
    { title: "Product Line — Studio Series", category: "Products", color: "#1D2733", slug: "studio-products" },
    { title: "Corporate Headshots", category: "People", color: "#1D2733", slug: "corporate-headshots" },
    { title: "Event Coverage", category: "Events", color: "#1D2733", slug: "event-coverage" },
    { title: "Architecture & Spaces", category: "Places", color: "#1D2733", slug: "architecture-spaces" },
  ],
  Video: [
    { title: "Brand Film — Meridian", category: "Stories", featured: true, color: "#1D2733", slug: "meridian-film" },
    { title: "Campaign Ad :30", category: "Campaign", color: "#1D2733", slug: "campaign-ad" },
    { title: "Event Highlight Reel", category: "Events", color: "#1D2733", slug: "event-reel" },
    { title: "Product Launch Video", category: "Campaign", color: "#1D2733", slug: "product-launch" },
    { title: "Interview Series", category: "Stories", color: "#1D2733", slug: "interview-series" },
  ],
};

export default function ProjectsPage() {
  const [activeMedium, setActiveMedium] = useState<Medium>("Design");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const projects = placeholderProjects[activeMedium];
  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <section
      className="relative min-h-screen overflow-hidden pt-28 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <LogoPattern />
      <GradientBlob opacity={0.3} size={700} className="bottom-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Label */}
        <motion.p
          className="section-label mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Projects
        </motion.p>

        {/* Medium tabs + Category filters */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          {/* Medium tabs */}
          <div className="flex gap-1">
            {(["Design", "Photo", "Video"] as Medium[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setActiveMedium(m);
                  setActiveCategory("All");
                }}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
                style={{
                  background: activeMedium === m ? "var(--color-white)" : "transparent",
                  color: activeMedium === m ? "var(--color-bg)" : "rgba(255,255,255,0.45)",
                  letterSpacing: "0.05em",
                  border: activeMedium === m ? "none" : "1px solid rgba(51,65,85,0.5)",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {["All", ...categories[activeMedium]].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  background: activeCategory === cat ? "var(--color-gold)" : "transparent",
                  color: activeCategory === cat ? "var(--color-bg)" : "rgba(255,255,255,0.6)",
                  border: activeCategory === cat ? "none" : "1px solid rgba(51,65,85,0.6)",
                  letterSpacing: "0.05em",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMedium + activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4"
          >
            {/* Featured tile */}
            {featured && (
              <Link
                href={`/projects/${featured.slug}`}
                className="lg:col-span-3 group relative rounded-2xl overflow-hidden"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid rgba(51,65,85,0.5)",
                  minHeight: 380,
                }}
              >
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: "var(--color-coral)", letterSpacing: "0.07em" }}
                    >
                      {featured.category}
                    </span>
                    <h3 className="text-xl font-extrabold mt-1">{featured.title}</h3>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                  style={{
                    background: "linear-gradient(to top, rgba(0,22,42,0.85) 0%, transparent 60%)",
                  }}
                />
              </Link>
            )}

            {/* Side tiles */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4">
              {rest.slice(0, 4).map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group relative rounded-2xl overflow-hidden flex items-end"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid rgba(51,65,85,0.5)",
                    minHeight: i === 0 ? 180 : 100,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                    style={{
                      background: "linear-gradient(to top, rgba(0,22,42,0.85) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative z-10 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: "var(--color-coral)", letterSpacing: "0.07em" }}
                    >
                      {p.category}
                    </span>
                    <p className="text-sm font-bold mt-0.5">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
