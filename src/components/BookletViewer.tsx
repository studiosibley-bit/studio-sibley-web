"use client";

import { forwardRef, useRef, useState } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";

export type BookletPage = { url: string; width: number; height: number };

const Page = forwardRef<HTMLDivElement, { img: BookletPage; title: string; index: number }>(
  ({ img, title, index }, ref) => (
    <div ref={ref} style={{ position: "relative", background: "#f5f5f0" }}>
      <Image
        src={img.url}
        alt={`${title} — page ${index + 1}`}
        fill
        quality={92}
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, 600px"
        priority={index === 0}
      />
    </div>
  )
);
Page.displayName = "BookletPage";

export default function BookletViewer({ pages, title }: { pages: BookletPage[]; title: string }) {
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  if (pages.length === 0) return null;

  const first = pages[0];
  const aspect = first.width && first.height ? first.width / first.height : 0.72;

  // width/height describe ONE page. With usePortrait + showCover, the engine
  // shows the cover alone (closed book), then real two-page spreads in the
  // middle, then the back cover alone — exactly a physical booklet's
  // open/close behavior. minWidth governs the portrait-mode breakpoint: below
  // ~2 * minWidth of container width it drops to single-page view (mobile).
  const baseWidth = 440;
  const baseHeight = Math.round(baseWidth / aspect);
  const minWidth = 280;
  const minHeight = Math.round(minWidth / aspect);
  const maxWidth = 540;
  const maxHeight = Math.round(maxWidth / aspect);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
      <div style={{ width: "100%", maxWidth: maxWidth * 2, position: "relative" }}>
        <HTMLFlipBook
          ref={bookRef}
          width={baseWidth}
          height={baseHeight}
          size="stretch"
          minWidth={minWidth}
          maxWidth={maxWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          showCover={true}
          mobileScrollSupport={true}
          drawShadow={true}
          flippingTime={650}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={20}
          showPageCorners={true}
          disableFlipByClick={false}
          startPage={0}
          className="booklet-flip"
          style={{}}
          onFlip={(e: { data: number }) => setPageIndex(e.data)}
        >
          {pages.map((p, i) => (
            <Page key={i} img={p} title={title} index={i} />
          ))}
        </HTMLFlipBook>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          disabled={pageIndex === 0}
          aria-label="Previous page"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            color: pageIndex === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
            cursor: pageIndex === 0 ? "default" : "pointer",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          ←
        </button>

        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          {pageIndex + 1} / {pages.length}
        </p>

        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          disabled={pageIndex === pages.length - 1}
          aria-label="Next page"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
            color: pageIndex === pages.length - 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
            cursor: pageIndex === pages.length - 1 ? "default" : "pointer",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
