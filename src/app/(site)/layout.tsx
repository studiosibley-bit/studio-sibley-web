import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { client } from "@/sanity/client";
import { siteSettingsQuery, type SiteSettings } from "@/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let copyrightYear: number | undefined;

  try {
    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    copyrightYear = settings?.copyrightYear;
  } catch {
    // Falls back to the current year when Sanity isn't configured yet
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer copyrightYear={copyrightYear} />
    </>
  );
}
