import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ConnectClient from "./ConnectClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio Sibley to start your next photo, video, or design project.",
};

export default async function ConnectPage() {
  let bgUrl: string | undefined;

  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    if (settings?.connectBg) bgUrl = urlFor(settings.connectBg).width(1920).url();
  } catch {
    // Falls back to static background
  }

  return <ConnectClient bgUrl={bgUrl} />;
}
