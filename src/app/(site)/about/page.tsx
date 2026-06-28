import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  let aboutPhotoUrl: string | null = null;
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch(siteSettingsQuery);
    if (settings?.aboutPhoto) {
      aboutPhotoUrl = urlFor(settings.aboutPhoto).width(1000).height(1250).fit("crop").url();
    }
    if (settings?.aboutBg) {
      bgUrl = urlFor(settings.aboutBg).width(1920).url();
    }
  } catch {
    // Falls back to placeholder when Sanity isn't configured yet
  }

  return <AboutClient aboutPhotoUrl={aboutPhotoUrl} bgUrl={bgUrl} />;
}
