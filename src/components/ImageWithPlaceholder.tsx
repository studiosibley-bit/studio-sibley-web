"use client";

import Image, { type ImageProps } from "next/image";

// Drop-in replacement for next/image's Image. Renders "Image loading…" text
// centered behind the image; once the image decodes, its own opaque pixels
// cover the text completely — no state, no fade, nothing to fail silently.
// Requires the nearest ancestor to be position:relative (same requirement
// `fill` already has, and every non-fill call site here provides its own
// sized, relatively-positioned wrapper).
export default function ImageWithPlaceholder(props: ImageProps) {
  return (
    <>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.03em",
          pointerEvents: "none",
        }}
      >
        Image loading…
      </span>
      <Image {...props} />
    </>
  );
}
