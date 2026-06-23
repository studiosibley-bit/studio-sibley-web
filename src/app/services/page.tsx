"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoPattern from "@/components/LogoPattern";

const services = [
  {
    title: "Design",
    subtitle: "Build a recognizable brand.",
    items: [
      "Logos & Identity",
      "Brochure & Poster Design",
      "Marketing & Promo Materials",
      "Signage & Banners",
    ],
  },
  {
    title: "Photo",
    subtitle: "Show your business at its best.",
    items: [
      "Brand Photography",
      "Product Photography",
      "Events",
      "Headshots & Group Portraits",
    ],
  },
  {
    title: "Video",
    subtitle: "Tell your story through motion.",
    items: [
      "Brand Films & Ads",
      "Promo Videos",
      "Event Coverage",
      "Interviews",
    ],
  },
];

export default function ServicesPage() {
  return (
    <section
      className="relative min-h-screen overflow-hidden pt-28 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <LogoPattern />
      <GradientBlob opacity={0.3} size={700} className="bottom-0 -right-24" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Label + headline */}
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Services
        </motion.p>

        <motion.h1
          className="font-extrabold mb-5"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "800px",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          Everything your brand needs to be seen
        </motion.h1>

        <motion.p
          className="max-w-2xl mb-14"
          style={{
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          From visual identity to photography and video production, Studio
          Sibley helps your business create a cohesive brand experience anywhere
          your audience finds you.
        </motion.p>

        {/* Service card */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-16"
          style={{ background: "var(--color-surface)", border: "1px solid rgba(51,65,85,0.5)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(51,65,85,0.4)]">
            {services.map((s, i) => (
              <div key={s.title} className="p-8 lg:p-10">
                <h3
                  className="font-bold mb-2"
                  style={{ color: "var(--color-coral)", letterSpacing: "0.05em", fontSize: "0.85rem", textTransform: "uppercase" }}
                >
                  {s.title}
                </h3>
                <p
                  className="italic mb-5"
                  style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300, fontSize: "0.9rem" }}
                >
                  {s.subtitle}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "rgba(255,255,255,0.8)", fontWeight: 300 }}
                    >
                      <span
                        className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--color-gold)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA block */}
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-extrabold mb-5"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Tell me your vision...
          </h2>
          <p
            className="mb-9"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontWeight: 300,
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Whether you need a single service or a complete creative package,
            every project is approached with the same attention to detail and
            commitment to quality.
          </p>
          <Link
            href="/connect"
            className="btn-coral px-9 py-4 text-sm"
            style={{ letterSpacing: "0.09em", fontSize: "0.8rem" }}
          >
            LET'S CREATE
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
