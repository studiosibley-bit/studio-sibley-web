import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ProjectDetailClient from "./ProjectDetailClient";

type SanityImage = { asset: { _ref: string } };

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

  const thumbnailUrl = raw.thumbnail
    ? urlFor(raw.thumbnail).width(1800).url()
    : undefined;

  const galleryUrls = (raw.images ?? []).map((img) =>
    urlFor(img).width(1800).url()
  );

  return (
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
        galleryUrls,
      }}
    />
  );
}
