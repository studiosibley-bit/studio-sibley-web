import { client } from "@/sanity/client";
import { projectsQuery, siteSettingsQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  let projects = [];
  let bgUrl: string | undefined;

  try {
    const [fetched, settings] = await Promise.all([
      client.fetch(projectsQuery),
      client.fetch(siteSettingsQuery),
    ]);
    projects = fetched ?? [];
    if (settings?.projectsBg) bgUrl = urlFor(settings.projectsBg).width(1920).url();
  } catch {
    // Falls back to placeholders when Sanity isn't configured yet
  }

  return <ProjectsClient projects={projects} bgUrl={bgUrl} />;
}
