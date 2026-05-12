import type { DailySchedule, OfficeDetail } from '~/types/umbraco'

/**
 * Resolve "today" as a YYYY-MM-DD string in the given IANA zone, falling
 * back to the system's UTC date if `Intl` rejects the zone.
 */
export function todayInZone(timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

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
  const isoDate = todayInZone(userTimezone ?? office.timezone)
  return office.schedule.find((d) => d.date === isoDate) ?? null
}

/**
 * Find the next entry in the rolling schedule (from `fromDate` inclusive)
 * that the office is actually open on — skipping both regularly-closed
 * days and override closures (holidays). Returns `null` when the visible
 * window contains no open day.
 */
export function findNextOpenDay(
  schedule: ReadonlyArray<DailySchedule>,
  fromDate: string,
): DailySchedule | null {
  return schedule.find((d) => d.date >= fromDate && !d.isClosed) ?? null
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
