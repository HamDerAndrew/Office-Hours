/**
 * Same-origin proxy for the upstream offices list endpoint. The custom
 * Umbraco API doesn't ship CORS headers, so the browser cannot call it
 * directly after hydration — every client-side fetch comes through here
 * and Nitro forwards to upstream server-to-server.
 */
export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig()
  const base = config.public.officesApiBase.replace(/\/$/, '')
  const query = getQuery(event)

  try {
    return await $fetch(`${base}/api/offices`, { query })
  } catch (err) {
    const status = (err as { statusCode?: number })?.statusCode ?? 502
    throw createError({
      statusCode: status,
      statusMessage: 'Failed to load offices from upstream API',
    })
  }
})
