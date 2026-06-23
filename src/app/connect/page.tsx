"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GradientBlob from "@/components/GradientBlob";
import LogoPattern from "@/components/LogoPattern";

const inputStyle: React.CSSProperties = {
  background: "var(--color-mid)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "0.75rem",
  padding: "0.85rem 1.1rem",
  color: "var(--color-white)",
  fontWeight: 300,
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s ease",
};

export default function ConnectPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden pt-28 pb-20"
      style={{ background: "var(--color-bg)" }}
    >
      <LogoPattern />
      {/* More prominent blob per mockup */}
      <GradientBlob opacity={0.5} size={900} className="-bottom-40 -right-32" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Connect
        </motion.p>

        <motion.h1
          className="font-extrabold mb-12"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          Send me a message.
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                required
                placeholder="Isaiah"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,150,111,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                required
                placeholder="Sibley"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,150,111,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,150,111,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Subject
            </label>
            <input
              name="subject"
              type="text"
              required
              placeholder="Brand photography project"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,150,111,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Message
            </label>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell me about your idea. Describe your project, timeline, and goals."
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,150,111,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div className="mt-2">
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="btn-coral px-9 py-4 text-sm w-full sm:w-auto"
              style={{ letterSpacing: "0.07em", opacity: status === "sending" ? 0.7 : 1 }}
            >
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                ? "Message Sent ✓"
                : "Send Message"}
            </button>

            {status === "error" && (
              <p className="mt-3 text-sm" style={{ color: "var(--color-coral)" }}>
                Something went wrong. Please try again or email directly.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
