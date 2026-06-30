import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import ConnectClient from "./ConnectClient";

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
