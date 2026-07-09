import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { projectSlugsQuery } from "@/sanity/queries";

// Mirrors the siteUrl logic in layout.tsx.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/services",
    "/about",
    "/connect",
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now }));

  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await client.fetch<string[]>(projectSlugsQuery);
    projectEntries = (slugs ?? []).map((slug) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: now,
    }));
  } catch {
    // If Sanity is unreachable at build time, ship the static routes only.
  }

  return [...staticEntries, ...projectEntries];
}
