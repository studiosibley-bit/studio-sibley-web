import { Suspense } from "react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ProjectDetailClient from "./ProjectDetailClient";

type Dims = { width: number; height: number };
type SanityImage = { asset: { _ref: string }; dimensions?: Dims };

type RawProject = {
  _id: string;
  title: string;
  slug: string;
  medium: string;
  category: string;
  description?: string;
  videoUrl?: string;
  thumbnail?: SanityImage;
  images?: SanityImage[];
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let raw: RawProject | null = null;
  try {
    raw = await client.fetch<RawProject>(projectBySlugQuery, { slug });
  } catch {
    notFound();
  }

  if (!raw) notFound();

  const FALLBACK_W = 1800;
  const FALLBACK_H = 1200;

  const thumbnailUrl = raw.thumbnail ? urlFor(raw.thumbnail).url() : undefined;
  const thumbnailWidth = raw.thumbnail?.dimensions?.width ?? FALLBACK_W;
  const thumbnailHeight = raw.thumbnail?.dimensions?.height ?? FALLBACK_H;

  const galleryImages = (raw.images ?? []).map((img) => ({
    url: urlFor(img).url(),
    width: img.dimensions?.width ?? FALLBACK_W,
    height: img.dimensions?.height ?? FALLBACK_H,
  }));

  return (
    <Suspense fallback={null}>
      <ProjectDetailClient
        project={{
          _id: raw._id,
          title: raw.title,
          slug: raw.slug,
          medium: raw.medium,
          category: raw.category,
          description: raw.description,
          videoUrl: raw.videoUrl,
          thumbnailUrl,
          thumbnailWidth,
          thumbnailHeight,
          galleryImages,
        }}
      />
    </Suspense>
  );
}
