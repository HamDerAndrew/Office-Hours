import { defineStore } from 'pinia'

export type GeolocationStatus =
  | 'idle'
  | 'pending'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error'

export interface UserCoords {
  lat: number
  lng: number
}

/**
 * Cross-route client state: the user's resolved IANA timezone and (opt-in)
 * coordinates. Both personalise the offices list — timezone drives status
 * and opening-hours display, coordinates add `distanceMeters` to each office.
 *
 * Browser-only. The server pass leaves both null and the offices API falls
 * back accordingly. A client-side refetch enhances with whatever the visitor
 * grants.
 */
export const useUserContextStore = defineStore('userContext', () => {
  const timezone = ref<string | null>(null)
  const coords = ref<UserCoords | null>(null)
  const geolocationStatus = ref<GeolocationStatus>('idle')

  function detectTimezone(): void {
    if (import.meta.server) return

    try {
      // A timezone is for example 'Europe/Copenhagen'
      timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || null
    } catch {
      timezone.value = null
    }
  }

  function readPosition(): Promise<UserCoords> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => reject(err),
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 5 * 60_000,
        },
      )
    })
  }

  async function requestLocation(): Promise<void> {
    if (import.meta.server) return
    if (!('geolocation' in navigator)) {
      geolocationStatus.value = 'unavailable'
      return
    }

    geolocationStatus.value = 'pending'
    try {
      coords.value = await readPosition()
      geolocationStatus.value = 'granted'
    } catch (err) {
      const code = (err as GeolocationPositionError | undefined)?.code
      geolocationStatus.value =
        code === 1 /* PERMISSION_DENIED */ ? 'denied' : 'error'
      coords.value = null
    }
  }

  function clearLocation(): void {
    coords.value = null
    if (geolocationStatus.value === 'granted') {
      geolocationStatus.value = 'idle'
    }
  }

  /**
   * If the visitor previously granted geolocation in this browser, fetch
   * coordinates silently — no second prompt, no UI noise. Uses the
   * Permissions API where available; otherwise no-op (the visitor will
   * have to click the toggle again).
   */
  async function restoreLocationIfGranted(): Promise<void> {
    if (import.meta.server) return
    if (!('permissions' in navigator) || !('geolocation' in navigator)) return

    try {
      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName,
      })
      if (result.state === 'granted') {
        await requestLocation()
      }
    } catch {
      // Permissions API may reject for unsupported names on some browsers.
      // Treat as "no soft restore" and wait for an explicit user action.
    }
  }

  return {
    timezone,
    coords,
    geolocationStatus,
    detectTimezone,
    requestLocation,
    clearLocation,
    restoreLocationIfGranted,
  }
})
