import { storeToRefs } from 'pinia'
import {
  OfficeDetailSchema,
  OfficesListResponseSchema,
  type OfficeDetail,
} from '~/types/umbraco'
import { officeSlug } from '~/utils/officeSlug'

/**
 * Resolve an office by its URL slug and return the full detail payload.
 *
 * The API only addresses offices by Guid `id`, so this composable does a
 * two-step fetch — list first to map slug → id, then the detail endpoint.
 * Both calls go through the same-origin Nitro proxy (`/api/offices*`)
 * because the upstream Umbraco surface doesn't ship CORS headers.
 *
 * A missing slug surfaces as a 404 so the page renders an error state via
 * Nuxt's error boundary rather than a generic empty payload.
 *
 * Re-runs when `slug`, the resolved timezone, or the visitor's coordinates
 * change — distance and status both depend on the latter two.
 */
export function useOfficeBySlug(slug: MaybeRefOrGetter<string>) {
  const { timezone, coords } = storeToRefs(useUserContextStore())
  const slugRef = computed(() => toValue(slug))

  return useAsyncData<OfficeDetail>(
    () => `office-by-slug:${slugRef.value}`,
    async () => {
      const query: Record<string, string> = {}
      if (timezone.value) query.timezone = timezone.value
      if (coords.value) {
        query.lat = String(coords.value.lat)
        query.lng = String(coords.value.lng)
      }

      const list = OfficesListResponseSchema.parse(
        await $fetch('/api/offices', { query }),
      )

      const match = list.offices.find(
        (o) => officeSlug(o.name) === slugRef.value,
      )
      if (!match) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Office not found',
          fatal: true,
        })
      }

      const raw = await $fetch(`/api/offices/${match.id}`, { query })
      return OfficeDetailSchema.parse(raw)
    },
    { watch: [slugRef, timezone, coords] },
  )
}
