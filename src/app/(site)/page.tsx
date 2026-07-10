import { client } from "@/sanity/client";
import {
  testimonialsQuery,
  siteSettingsQuery,
  featuredProjectsQuery,
  type Testimonial,
  type SiteSettings,
  type FeaturedProject,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import HeroClient, { type HeroProject } from "./HeroClient";

const defaultTestimonials = [
  {
    _id: "default-1",
    quote: "Studio Sibley completely changed how our brand shows up online. The photography was exactly what we needed — professional, warm, and unmistakably us.",
    name: "Sarah M.",
    role: "Founder, Elm & Co.",
  },
  {
    _id: "default-2",
    quote: "The brand film they produced exceeded every expectation. Every frame felt intentional, polished, and true to what we wanted to communicate.",
    name: "James T.",
    role: "Creative Director",
  },
  {
    _id: "default-3",
    quote: "From logo to full campaign rollout, they handled everything with professionalism and real creative vision. I'd recommend Studio Sibley without hesitation.",
    name: "Priya L.",
    role: "Marketing Manager",
  },
];

export default async function Home() {
  let testimonials = defaultTestimonials;
  let bgUrl: string | undefined;
  // Off by default — the testimonials section only renders once it's explicitly
  // enabled in Sanity (Site Settings → "Show testimonials on home page").
  let showTestimonials = false;
  let heroProjects: HeroProject[] = [];

  try {
    const [fetched, settings, featured] = await Promise.all([
      client.fetch<Testimonial[]>(testimonialsQuery),
      client.fetch<SiteSettings>(siteSettingsQuery),
      client.fetch<FeaturedProject[]>(featuredProjectsQuery),
    ]);
    if (fetched && fetched.length > 0) testimonials = fetched;
    if (settings?.heroBg) bgUrl = urlFor(settings.heroBg).width(1920).url();
    showTestimonials = settings?.showTestimonials === true;
    heroProjects = (featured ?? [])
      .filter((p) => p.thumbnail && p.slug)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        imgUrl: urlFor(p.thumbnail!).width(1000).height(750).fit("crop").url(),
      }));
  } catch {
    // Falls back to defaults when Sanity isn't configured yet
  }

  return (
    <HeroClient
      testimonials={testimonials}
      bgUrl={bgUrl}
      showTestimonials={showTestimonials}
      heroProjects={heroProjects}
    />
  );
}
