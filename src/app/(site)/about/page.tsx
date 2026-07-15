import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    if (settings?.aboutBg) {
      bgUrl = urlFor(settings.aboutBg).width(1920).url();
    }
  } catch {
    // Falls back to a placeholder when Sanity isn't configured yet
  }

  return <AboutClient bgUrl={bgUrl} />;
}
