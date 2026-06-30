import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      // Default static staleTime is 5 minutes — any prefetched <Link> (e.g.
      // the Navbar's persistent "Projects" link) can serve an instantly-shown
      // cached render of a route for up to 5 minutes after it was last
      // visited/prefetched. PageTransition.tsx's scroll-restore now handles
      // the stale-content-flash this can cause on its own (see the comment
      // on `armScrollRestore` there), so this isn't load-bearing for that
      // anymore — kept because edits made in Sanity Studio should show up
      // immediately on navigation instead of waiting out the cache window.
      static: 0,
    },
  },
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
