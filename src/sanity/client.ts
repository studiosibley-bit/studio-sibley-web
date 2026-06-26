import { createClient, type SanityClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from './env'

const isConfigured = Boolean(projectId) && /^[a-z0-9-]+$/.test(projectId)

let _client: SanityClient | null = null

function getSanityClient(): SanityClient | null {
  if (!isConfigured) return null
  if (!_client) {
    _client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  }
  return _client
}

export const client = {
  fetch: async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
    const c = getSanityClient()
    if (!c) throw new Error('Sanity not configured')
    return c.fetch<T>(query, params)
  },
}
