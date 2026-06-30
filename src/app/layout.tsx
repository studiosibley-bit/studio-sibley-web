import type { Metadata } from "next";
import "./globals.css";

// VERCEL_PROJECT_PRODUCTION_URL is set automatically by Vercel and tracks
// whatever domain is currently the production one — once the custom domain
// (studiosibley.com) finishes connecting, this updates with no code change.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Studio Sibley — Photo, Video & Design";
const description =
  "Photo, video, and design for those who want more than the bare minimum.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Studio Sibley",
  },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Studio Sibley",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
