import { storeToRefs } from 'pinia'
import {
  OfficesListResponseSchema,
  type OfficesListResponse,
} from '~/types/umbraco'

/**
 * Fetches the offices list through the same-origin Nitro proxy
 * (`/api/offices`), validated through Zod.
 *
 * Reactively re-fetches when the user's resolved timezone changes — the SSR
 * pass uses no timezone (offices' own zones), the client hydrates with the
 * resolved IANA zone so status/hours reflect the visitor's perspective.
 */
export function useOfficesList() {
  const { timezone } = storeToRefs(useUserContextStore())

  return useAsyncData<OfficesListResponse>(
    'offices-list',
    async () => {
      const query: Record<string, string> = {}
      if (timezone.value) query.timezone = timezone.value
      const raw = await $fetch('/api/offices', { query })
      return OfficesListResponseSchema.parse(raw)
    },
    { watch: [timezone] },
  )
}
