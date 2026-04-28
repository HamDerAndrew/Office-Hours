import { storeToRefs } from 'pinia'
import { OfficeDetailSchema, type OfficeDetail } from '~/types/umbraco'

/**
 * Fetches a single office through the same-origin Nitro proxy
 * (`/api/offices/{id}`), validated through Zod.
 *
 * Re-fetches when either `id` or the user's resolved timezone changes.
 */
export function useOfficeDetail(id: MaybeRefOrGetter<string>) {
  const { timezone } = storeToRefs(useUserContextStore())
  const idRef = computed(() => toValue(id))

  return useAsyncData<OfficeDetail>(
    () => `office-detail:${idRef.value}`,
    async () => {
      const query: Record<string, string> = {}
      if (timezone.value) query.timezone = timezone.value
      const raw = await $fetch(`/api/offices/${idRef.value}`, { query })
      return OfficeDetailSchema.parse(raw)
    },
    { watch: [idRef, timezone] },
  )
}
