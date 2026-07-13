import { groq } from 'next-sanity'

type SanityImageRef = { asset: { _ref: string } }

export type SiteSettings = {
  showTestimonials?: boolean
  aboutPhoto?: SanityImageRef
  aboutStoryPhoto?: SanityImageRef
  heroBg?: SanityImageRef
  projectsBg?: SanityImageRef
  servicesBg?: SanityImageRef
  aboutBg?: SanityImageRef
  connectBg?: SanityImageRef
}

export type Testimonial = {
  _id: string
  quote: string
  name: string
  role: string
  rating?: number
}

export type ListProject = {
  _id: string
  title: string
  slug: string
  medium: string
  category: string
  featured?: boolean
  tileSize?: 'full' | 'half' | 'third'
  role?: string[]
  year?: number
  thumbnail?: SanityImageRef & { dimensions?: { width: number; height: number } }
  description?: string
}

// Just the slugs — used to build the sitemap.
export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`

export type FeaturedProject = {
  _id: string
  title: string
  slug: string
  medium?: string
  thumbnail?: SanityImageRef
}

// Featured projects (with a thumbnail) for the home hero strip.
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && defined(thumbnail) && defined(slug.current)]
    | order(order asc, _createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      medium,
      thumbnail,
    }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    medium,
    category,
    featured,
    tileSize,
    role,
    year,
    thumbnail {
      ...,
      "dimensions": asset->metadata.dimensions,
    },
    description,
    videoUrl,
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    medium,
    category,
    featured,
    brief,
    role,
    year,
    heroVideo {
      asset-> { url }
    },
    thumbnail {
      ...,
      "dimensions": asset->metadata.dimensions,
    },
    description,
    videoUrl,
    fullImages[] {
      ...,
      "dimensions": asset->metadata.dimensions,
    },
    images[] {
      ...,
      "dimensions": asset->metadata.dimensions,
    },
    isBooklet,
    bookletSpreads[] {
      ...,
      "dimensions": asset->metadata.dimensions,
    },
  }
`

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc, _createdAt asc) {
    _id,
    quote,
    name,
    role,
    rating,
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    showTestimonials,
    aboutPhoto,
    aboutStoryPhoto,
    heroBg,
    projectsBg,
    servicesBg,
    aboutBg,
    connectBg,
  }
`
