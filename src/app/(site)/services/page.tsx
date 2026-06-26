import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch(siteSettingsQuery);
    if (settings?.servicesBg) bgUrl = urlFor(settings.servicesBg).width(1920).url();
  } catch {
    // Falls back to static background
  }

  return <ServicesClient bgUrl={bgUrl} />;
}
