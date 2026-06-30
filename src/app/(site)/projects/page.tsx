import { Suspense } from "react";
import { client } from "@/sanity/client";
import { projectsQuery, siteSettingsQuery, type ListProject, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  let projects: ListProject[] = [];
  let bgUrl: string | undefined;

  try {
    const [fetched, settings] = await Promise.all([
      client.fetch<ListProject[]>(projectsQuery),
      client.fetch<SiteSettings>(siteSettingsQuery),
    ]);
    projects = fetched ?? [];
    if (settings?.projectsBg) bgUrl = urlFor(settings.projectsBg).width(1920).url();
  } catch {
    // Falls back to placeholders when Sanity isn't configured yet
  }

  return (
    <Suspense fallback={null}>
      <ProjectsClient projects={projects} bgUrl={bgUrl} />
    </Suspense>
  );
}
