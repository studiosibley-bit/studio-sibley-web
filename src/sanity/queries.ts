import { groq } from 'next-sanity'

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
    aboutPhoto,
    heroBg,
    projectsBg,
    servicesBg,
    aboutBg,
    connectBg,
  }
`
