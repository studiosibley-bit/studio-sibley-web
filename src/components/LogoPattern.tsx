"use client";

export default function LogoPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{
        backgroundImage: "url('/svgs/logo-pattern.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "120px",
        opacity: 0.06,
      }}
    />
  );
}
