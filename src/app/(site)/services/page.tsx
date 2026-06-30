import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    if (settings?.servicesBg) bgUrl = urlFor(settings.servicesBg).width(1920).url();
  } catch {
    // Falls back to static background
  }

  return <ServicesClient bgUrl={bgUrl} />;
}
