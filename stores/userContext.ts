import { defineStore } from 'pinia'

/**
 * Cross-route client state: the user's resolved IANA timezone, used to
 * personalise office status and opening-hours display. Browser-only — the
 * server pass leaves it null and the offices API falls back to each office's
 * own zone, then a client-side refetch enhances with the resolved zone.
 */
export const useUserContextStore = defineStore('userContext', () => {
  const timezone = ref<string | null>(null)

  function detectTimezone(): void {
    if (import.meta.server) return

    try {
      // A timezone is for example 'Europe/Copenhagen'
      timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || null
    } catch {
      timezone.value = null
    }
  }

  return { timezone, detectTimezone }
})
