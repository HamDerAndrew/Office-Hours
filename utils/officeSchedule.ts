import type { DailySchedule, OfficeDetail } from '~/types/umbraco'

/**
 * Returns the schedule entry for "today" relative to the user's timezone if
 * one is resolved, otherwise the office's own timezone.
 *
 * The API ships a 21-day window: 7 back, today, 13 forward. Today is the
 * 8th entry, but we match on the local date string ("YYYY-MM-DD") to be safe.
 */
export function findTodaySchedule(
  office: OfficeDetail,
  userTimezone: string | null,
): DailySchedule | null {
  const tz = userTimezone ?? office.timezone
  let isoDate: string
  try {
    isoDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
  } catch {
    isoDate = new Date().toISOString().slice(0, 10)
  }
  return office.schedule.find((d) => d.date === isoDate) ?? null
}

/**
 * Format an `"HH:mm"` time pair into a single readable range, e.g. `"09:00 – 17:00"`.
 * Returns `null` when either bound is missing.
 */
export function formatHoursRange(
  open: string | null,
  close: string | null,
): string | null {
  if (!open || !close) return null
  return `${open} – ${close}`
}
