import { storeToRefs } from 'pinia'
import {
  OfficeDetailSchema,
  OfficesListResponseSchema,
  type OfficeDetail,
} from '~/types/umbraco'

export interface OfficesWithHours {
  countries: string[]
  offices: OfficeDetail[]
}

/**
 * Homepage composite: fetches the offices list, then loads each office's
 * detail in parallel so cards can render today's hours alongside status.
 *
 * One `useAsyncData` call so SSR + client hydration work as a single unit.
 * All requests go through the same-origin Nitro proxy (`/api/offices*`)
 * because the upstream Umbraco API doesn't ship CORS headers.
 *
 * Re-runs when the user's resolved timezone changes.
 */
export function useOfficesWithHours() {
  const { timezone } = storeToRefs(useUserContextStore())

  return useAsyncData<OfficesWithHours>(
    'offices-with-hours',
    async () => {
      const query: Record<string, string> = {}
      if (timezone.value) query.timezone = timezone.value

      const list = OfficesListResponseSchema.parse(
        await $fetch('/api/offices', { query }),
      )

      const offices = await Promise.all(
        list.offices.map(async (item) => {
          const raw = await $fetch(`/api/offices/${item.id}`, { query })
          return OfficeDetailSchema.parse(raw)
        }),
      )

      return { countries: list.countries, offices }
    },
    { watch: [timezone] },
  )
}
