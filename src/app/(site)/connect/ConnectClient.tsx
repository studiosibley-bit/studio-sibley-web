"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";
import ConnectForm from "./ConnectForm";

export default function ConnectClient({ bgUrl }: { bgUrl?: string }) {
  const reduced = useReducedMotion();

  function fu(delay: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay, ease },
    };
  }

  return (
    <section
      style={{
        paddingTop: "68px",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/connect.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ padding: "3.5rem 2.5rem 4rem", position: "relative", zIndex: 1 }}>
        <motion.div {...fu(0)}>
          <p className="section-label" style={{ marginBottom: "1.25rem" }}>Connect</p>
        </motion.div>

        <motion.h1
          {...fu(0.08)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 2rem",
            textAlign: "center",
          }}
        >
          Send me a message.
        </motion.h1>

        <motion.div
          {...fu(0.18)}
          style={{ maxWidth: "680px", margin: "0 auto" }}
        >
          <ConnectForm />
        </motion.div>
      </div>
    </section>
  );
}
