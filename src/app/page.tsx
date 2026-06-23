"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoPattern from "@/components/LogoPattern";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "var(--color-bg)" }}
      >
        <LogoPattern />

        {/* Warm gradient blob — lower right */}
        <GradientBlob
          opacity={0.43}
          size={800}
          className="-bottom-40 -right-32 md:-right-16"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 md:pt-40 md:pb-32">
          <motion.p
            className="section-label mb-5"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Studio Sibley
          </motion.p>

          <motion.h1
            className="font-extrabold leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 800 }}
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            What It Looks
            <br />
            Like,{" "}
            <span style={{ color: "var(--color-coral)" }}>Matters.</span>
          </motion.h1>

          <motion.p
            className="max-w-xl mb-10"
            style={{
              fontWeight: 300,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.65,
            }}
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Photo, video, and design for those who want more than the bare
            minimum.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/projects"
              className="btn-coral px-7 py-3 text-sm"
              style={{ letterSpacing: "0.05em" }}
            >
              View Work
            </Link>
            <Link
              href="#demo"
              className="btn-outline-light px-7 py-3 text-sm"
              style={{ letterSpacing: "0.05em" }}
            >
              Watch Demo Reel
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection />
    </>
  );
}

const placeholderTestimonials = [
  {
    quote:
      "Studio Sibley completely transformed how our brand is perceived. The photography and design work was beyond what we imagined.",
    name: "Alex R.",
    company: "Founder, Meridian Co.",
  },
  {
    quote:
      "Professional, creative, and detail-oriented. The video content they produced has been our highest-performing marketing asset.",
    name: "Jordan T.",
    company: "Marketing Director, Apex Solutions",
  },
  {
    quote:
      "From our logo to our launch video, everything was cohesive and polished. Clients constantly compliment our brand.",
    name: "Samantha K.",
    company: "Owner, The Oak & Fig",
  },
];

function TestimonialsSection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.p
          className="section-label mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Clients Say
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {placeholderTestimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{
                background: "var(--color-surface)",
                border: "1px solid rgba(51,65,85,0.5)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto">
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--color-white)" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-coral)" }}
                >
                  {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
