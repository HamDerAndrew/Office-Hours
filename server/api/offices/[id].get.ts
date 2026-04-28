/**
 * Same-origin proxy for the upstream office detail endpoint.
 * Forwards path id and query (`timezone`, `lat`, `lng`) verbatim and
 * preserves the upstream 404 so client error states render correctly.
 */
export default defineEventHandler(async (event): Promise<unknown> => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Office id is required',
    })
  }

  const config = useRuntimeConfig()
  const base = config.public.officesApiBase.replace(/\/$/, '')
  const query = getQuery(event)

  try {
    return await $fetch(`${base}/api/offices/${encodeURIComponent(id)}`, {
      query,
    })
  } catch (err) {
    const status = (err as { statusCode?: number })?.statusCode
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Office not found' })
    }
    throw createError({
      statusCode: status ?? 502,
      statusMessage: 'Failed to load office from upstream API',
    })
  }
})
