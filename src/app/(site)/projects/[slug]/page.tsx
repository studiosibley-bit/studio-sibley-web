import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ProjectDetailClient from "./ProjectDetailClient";
import FeaturedProjectClient from "./FeaturedProjectClient";

type Dims = { width: number; height: number };
type SanityImage = { asset: { _ref: string }; dimensions?: Dims };

type Page = { url: string; width: number; height: number };

const FALLBACK_W = 1800;
const FALLBACK_H = 1200;

/**
 * Splits the uploaded booklet spreads into individual reading-order pages.
 *
 * Spreads are uploaded exactly as a normal InDesign export gives them — the
 * cover spread first (back cover on the left, front cover on the right),
 * then every following spread as a plain sequential facing-page pair (2-3,
 * 4-5, 6-7, ...), the same order you'd read the booklet in. No press
 * imposition/reordering required. Each upload is split down the middle via
 * Sanity's `rect()` crop to recover the two true page halves.
 */
function unimposeBookletSpreads(spreads: SanityImage[]): Page[] {
  const totalPages = spreads.length * 2;
  const pages: Page[] = new Array(totalPages);

  function setHalves(img: SanityImage, leftPage: number, rightPage: number) {
    const w = img.dimensions?.width ?? FALLBACK_W;
    const h = img.dimensions?.height ?? FALLBACK_H;
    const halfW = Math.floor(w / 2);
    pages[leftPage - 1] = { url: urlFor(img).rect(0, 0, halfW, h).url(), width: halfW, height: h };
    pages[rightPage - 1] = { url: urlFor(img).rect(halfW, 0, w - halfW, h).url(), width: w - halfW, height: h };
  }

  spreads.forEach((img, i) => {
    if (i === 0) {
      // Cover spread: back cover (last page) on the left, front cover (page 1) on the right.
      setHalves(img, totalPages, 1);
    } else {
      // Sequential reading spread: pages (2i, 2i+1).
      setHalves(img, 2 * i, 2 * i + 1);
    }
  });

  return pages;
}

type RawProject = {
  _id: string;
  title: string;
  slug: string;
  medium: string;
  category: string;
  featured?: boolean;
  brief?: string;
  role?: string[];
  year?: number;
  heroVideo?: { asset?: { url?: string } };
  description?: string;
  videoUrl?: string;
  thumbnail?: SanityImage;
  fullImages?: SanityImage[];
  images?: SanityImage[];
  isBooklet?: boolean;
  bookletSpreads?: SanityImage[];
};

// Cached per-request so generateMetadata and the page component below share
// a single Sanity fetch instead of hitting the API twice for the same slug.
const getProject = cache(async (slug: string): Promise<RawProject | null> => {
  try {
    return await client.fetch<RawProject>(projectBySlugQuery, { slug });
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = await getProject(slug);
  if (!raw) return {};

  return {
    title: raw.title,
    description:
      raw.description ||
      raw.brief ||
      `${raw.title} — a ${raw.medium?.toLowerCase() ?? ""} project by Studio Sibley.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getProject(slug);

  if (!raw) notFound();

  const thumbnailUrl = raw.thumbnail ? urlFor(raw.thumbnail).url() : undefined;
  const thumbnailWidth = raw.thumbnail?.dimensions?.width ?? FALLBACK_W;
  const thumbnailHeight = raw.thumbnail?.dimensions?.height ?? FALLBACK_H;

  const fullSizeImages = (raw.fullImages ?? []).map((img) => ({
    url: urlFor(img).url(),
    width: img.dimensions?.width ?? FALLBACK_W,
    height: img.dimensions?.height ?? FALLBACK_H,
  }));

  const galleryImages = (raw.images ?? []).map((img) => ({
    url: urlFor(img).url(),
    width: img.dimensions?.width ?? FALLBACK_W,
    height: img.dimensions?.height ?? FALLBACK_H,
  }));

  const bookletPages = unimposeBookletSpreads(raw.bookletSpreads ?? []);

  const projectData = {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    medium: raw.medium,
    category: raw.category,
    thumbnailUrl,
    thumbnailWidth,
    thumbnailHeight,
    fullSizeImages,
    galleryImages,
    isBooklet: !!raw.isBooklet,
    bookletPages,
  };

  if (raw.featured) {
    return (
      <Suspense fallback={null}>
        <FeaturedProjectClient
          project={{
            ...projectData,
            brief: raw.brief,
            role: raw.role,
            year: raw.year,
            videoUrl: raw.videoUrl,
            heroVideoUrl: raw.heroVideo?.asset?.url ?? undefined,
          }}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <ProjectDetailClient
        project={{
          ...projectData,
          description: raw.description,
          videoUrl: raw.videoUrl,
        }}
      />
    </Suspense>
  );
}
