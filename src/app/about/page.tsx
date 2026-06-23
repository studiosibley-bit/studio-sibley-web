"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoPattern from "@/components/LogoPattern";

const bodyParagraphs = [
  "I believe too many businesses with real value get overlooked because their visuals don't reflect what they actually offer. Cheap design, AI-generated imagery, and rushed video all tells the public not to take you seriously — even when your product or service is amazing.",
  "That's what Studio Sibley was built to fix.",
  "I started this studio because I believe a strong brand image doesn't have to be out of reach. In a world that's more visual and more digital than ever, how your business looks shouldn't be an afterthought.",
  "Every company, regardless of size, deserves creative work that attracts the same attention as the biggest names in its industry. My job is to make sure yours gets it.",
  "Whether you need a logo that is unique to you, photography that actually represents your product, or video that moves people, I approach every project with the same commitment to quality. Because your story is worth telling well.",
];

export default function AboutPage() {
  return (
    <section
      className="relative min-h-screen overflow-hidden pt-28 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <LogoPattern />
      <GradientBlob opacity={0.3} size={650} className="-bottom-20 -right-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          About
        </motion.p>

        <motion.h1
          className="font-extrabold mb-12"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "700px",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          The Story Behind Studio Sibley
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Body text */}
          <motion.div
            className="lg:col-span-3 flex flex-col gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {bodyParagraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontWeight: i === 1 ? 700 : 300,
                  fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
                  color: i === 1 ? "var(--color-white)" : "rgba(255,255,255,0.8)",
                  lineHeight: 1.8,
                  fontStyle: i === 1 ? "italic" : "normal",
                }}
              >
                {p}
              </p>
            ))}

            <div className="mt-4">
              <Link
                href="/connect"
                className="btn-coral px-7 py-3.5 text-sm"
                style={{ letterSpacing: "0.06em" }}
              >
                WANT TO WORK TOGETHER?
              </Link>
            </div>
          </motion.div>

          {/* Photo placeholder */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div
              className="rounded-2xl w-full flex items-center justify-center"
              style={{
                background: "var(--color-surface)",
                border: "1px solid rgba(51,65,85,0.5)",
                aspectRatio: "3/4",
                maxHeight: "560px",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>
                Owner photo via Sanity
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
