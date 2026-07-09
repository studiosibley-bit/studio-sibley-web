import { client } from "@/sanity/client";
import { testimonialsQuery, siteSettingsQuery, type Testimonial, type SiteSettings } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import HeroClient from "./HeroClient";

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

  try {
    const [fetched, settings] = await Promise.all([
      client.fetch<Testimonial[]>(testimonialsQuery),
      client.fetch<SiteSettings>(siteSettingsQuery),
    ]);
    if (fetched && fetched.length > 0) testimonials = fetched;
    if (settings?.heroBg) bgUrl = urlFor(settings.heroBg).width(1920).url();
    showTestimonials = settings?.showTestimonials === true;
  } catch {
    // Falls back to defaults when Sanity isn't configured yet
  }

  return (
    <HeroClient testimonials={testimonials} bgUrl={bgUrl} showTestimonials={showTestimonials} />
  );
}
