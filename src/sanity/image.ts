import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { projectId, dataset } from './env'

const builder = imageUrlBuilder({ projectId: projectId || 'placeholder', dataset: dataset || 'production' })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
