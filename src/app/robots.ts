import type { MetadataRoute } from "next";

// Mirrors the siteUrl logic in layout.tsx: tracks the Vercel production domain
// (updates to studiosibley.com automatically once connected).
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep crawlers out of the CMS admin and API routes.
      disallow: ["/studio", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
