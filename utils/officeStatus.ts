import type { OfficeStatus } from '~/types/umbraco'

/**
 * Threshold (minutes) below which a status change is considered "imminent".
 * Used to distinguish "open" from "about to close" and "closed" from
 * "about to open" when sorting the offices list.
 */
export const ABOUT_TO_THRESHOLD_MIN = 60

/**
 * Sort buckets, lowest first. Match the order requested for the offices list:
 * open → about-to-open → about-to-close → closed.
 */
export const STATUS_BUCKET = {
  open: 0,
  aboutToOpen: 1,
  aboutToClose: 2,
  closed: 3,
} as const

export type StatusBucket = (typeof STATUS_BUCKET)[keyof typeof STATUS_BUCKET]

/**
 * Parse the API's human-readable `timeUntilChange` ("2h 30m", "45m", "1h")
 * into minutes. Returns `null` when the input is null/empty or doesn't
 * carry a recognisable hour/minute token — callers treat that as "no
 * imminent change" rather than "zero".
 */
export function parseTimeUntilChangeMinutes(
  timeUntilChange: string | null,
): number | null {
  if (!timeUntilChange) return null
  const hours = /(\d+)\s*h/i.exec(timeUntilChange)?.[1]
  const minutes = /(\d+)\s*m/i.exec(timeUntilChange)?.[1]
  if (!hours && !minutes) return null
  const h = hours ? Number.parseInt(hours, 10) : 0
  const m = minutes ? Number.parseInt(minutes, 10) : 0
  return h * 60 + m
}

export function getStatusBucket(
  status: OfficeStatus,
  thresholdMinutes: number = ABOUT_TO_THRESHOLD_MIN,
): StatusBucket {
  const minutesUntilChange = parseTimeUntilChangeMinutes(status.timeUntilChange)
  const imminent =
    minutesUntilChange !== null && minutesUntilChange <= thresholdMinutes

  if (status.isOpen) {
    return imminent ? STATUS_BUCKET.aboutToClose : STATUS_BUCKET.open
  }
  return imminent ? STATUS_BUCKET.aboutToOpen : STATUS_BUCKET.closed
}
