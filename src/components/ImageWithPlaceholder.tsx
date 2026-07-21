"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

// Drop-in replacement for next/image's Image that shows a minimal, centered
// "Image loading…" label while the image loads, then REMOVES it once the image
// has loaded.
//
// Removing the label (rather than letting the image's pixels paint over it)
// is required: for width/height images the <img> renders in normal flow while
// this label is absolutely positioned, so per CSS stacking the label paints
// ON TOP of the image and would never be covered; transparent images would
// also show it through. Once `loaded` flips true the label is unmounted, so
// none of that matters.
//
// When the caller passes placeholder="blur" (a real blurred preview, e.g.
// Sanity's LQIP), that blur already communicates the loading state on its
// own — the text label is skipped so the two don't stack.
//
// The nearest ancestor must be position:relative (every call site provides one,
// same requirement next/image's own `fill` mode has).
export default function ImageWithPlaceholder(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A cached image can already be `complete` before onLoad would ever fire, so
  // check on mount and clear the label immediately in that case.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && props.placeholder !== "blur" && (
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
      )}
      <Image
        {...props}
        ref={ref}
        onLoad={(e) => {
          setLoaded(true);
          props.onLoad?.(e);
        }}
      />
    </>
  );
}
