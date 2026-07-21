"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";

// /connect is linked from several places across the site (nav x2, hero,
// about, services x2). Next's default <Link> eagerly prefetches every
// viewport-visible instance, so loading a single page with a few of these
// links in view fired a burst of near-identical RSC prefetch requests for
// the same route. Deferring prefetch until real intent — hover on desktop,
// touch-start on mobile — keeps the "feels instant" benefit for users who
// are actually about to click, without the redundant traffic for everyone
// else. See Next's own "Preventing too many prefetches" guidance.
export default function ConnectLink({
  className,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  // A couple of call sites also use hover to drive a color transition
  // (see Footer.tsx) — those handlers still run, alongside the prefetch
  // intent flag below, rather than being replaced by it.
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      href="/connect"
      prefetch={intent ? null : false}
      onMouseEnter={(e) => {
        setIntent(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={onMouseLeave}
      onTouchStart={() => setIntent(true)}
      className={className}
      style={style}
    >
      {children}
    </Link>
  );
}
