import Link from "next/link";
import GradientBlob from "@/components/GradientBlob";
import LogoMark from "@/components/LogoMark";

export default function NotFound() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6"
      style={{ background: "var(--color-bg)" }}
    >
      <GradientBlob opacity={0.35} size={700} className="-bottom-32 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <LogoMark size={40} />

        <h1
          className="font-extrabold leading-none"
          style={{ fontSize: "clamp(6rem, 20vw, 14rem)", fontWeight: 800, color: "var(--color-coral)" }}
        >
          404
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300, fontSize: "1.1rem" }}>
          This page doesn't exist — but your brand can.
        </p>

        <div>
          <Link href="/" className="btn-coral text-sm" style={{ letterSpacing: "0.06em" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
