import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Sibley — Photo, Video & Design",
  description:
    "Photo, video, and design for those who want more than the bare minimum.",
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
