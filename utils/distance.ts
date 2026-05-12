/**
 * Format a distance in metres for display. Always returns kilometres above
 * 1 km; sub-kilometre distances render in metres so "750 m" reads more
 * naturally than "0.8 km" for a nearby office.
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return ''
  if (meters < 1000) return `${Math.round(meters)} m`
  const km = meters / 1000
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}
