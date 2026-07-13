import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  let aboutPhotoUrl: string | null = null;
  let storyPhotoUrl: string | null = null;
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    if (settings?.aboutPhoto) {
      aboutPhotoUrl = urlFor(settings.aboutPhoto).width(1100).height(1400).fit("crop").url();
    }
    if (settings?.aboutStoryPhoto) {
      storyPhotoUrl = urlFor(settings.aboutStoryPhoto).width(1200).height(900).fit("crop").url();
    }
    if (settings?.aboutBg) {
      bgUrl = urlFor(settings.aboutBg).width(1920).url();
    }
  } catch {
    // Falls back to placeholders when Sanity isn't configured yet
  }

  return <AboutClient aboutPhotoUrl={aboutPhotoUrl} storyPhotoUrl={storyPhotoUrl} bgUrl={bgUrl} />;
}
