<script setup lang="ts">
import type { DailySchedule, DayHours, OfficeDetail } from '~/types/umbraco'
import {
  findNextOpenDay,
  findTodaySchedule,
  formatHoursRange,
} from '~/utils/officeSchedule'

const props = defineProps<{
  office: OfficeDetail
  userTimezone: string | null
}>()

const WEEK_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

interface WeekRow {
  day: string
  hours: DayHours | null
}

const week = computed<WeekRow[]>(() =>
  WEEK_ORDER.map((day) => ({ day, hours: props.office.regularHours[day] ?? null })),
)

const today = computed<DailySchedule | null>(() =>
  findTodaySchedule(props.office, props.userTimezone),
)

/**
 * The single day-of-week to highlight in the table:
 *  - If the office is open → today's row.
 *  - Otherwise → the next day the office actually opens (skipping holidays
 *    and regularly-closed days), so the visitor sees when to come back.
 */
const highlightedDay = computed<string | null>(() => {
  const o = props.office
  if (o.status.isOpen) {
    return today.value?.dayOfWeek ?? null
  }
  const fromDate = today.value?.date ?? o.schedule[0]?.date ?? ''
  return findNextOpenDay(o.schedule, fromDate)?.dayOfWeek ?? null
})

const holidayToday = computed<DailySchedule | null>(() => {
  const t = today.value
  return t && t.isOverride && t.isClosed ? t : null
})

function rowHours(hours: DayHours | null): string {
  if (!hours || hours.isClosed) return 'Closed'
  const range = formatHoursRange(hours.open, hours.close)
  return range ?? 'Closed'
}
</script>

<template>
  <section class="schedule" aria-labelledby="weekly-heading">
    <header class="header">
      <h2 id="weekly-heading">Weekly schedule</h2>
      <p class="caption">
        Regular opening hours, shown in the office's local time.
      </p>
    </header>

    <p v-if="holidayToday" class="holiday-notice" role="status">
      <span class="holiday-eyebrow">Closed today</span>
      <span class="holiday-label">
        {{ holidayToday.overrideLabel ?? 'Holiday closure' }}
      </span>
    </p>

    <table class="week-table">
      <caption class="visually-hidden">
        Weekly opening hours for {{ office.name }}. The highlighted row marks
        {{ office.status.isOpen ? 'today, while the office is open' : 'the next day the office will open' }}.
      </caption>
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Hours</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in week"
          :key="row.day"
          :class="{ 'is-highlighted': row.day === highlightedDay }"
          :aria-current="row.day === highlightedDay ? 'true' : undefined"
        >
          <th scope="row" class="day-cell">
            <span class="day-name">{{ row.day }}</span>
            <span v-if="row.day === highlightedDay" class="day-hint">
              {{ office.status.isOpen ? 'Open now' : 'Next open' }}
            </span>
          </th>
          <td class="hours-cell">{{ rowHours(row.hours) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.schedule {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.header h2 {
  font-size: var(--text-xl);
  margin: 0;
}

.caption {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.holiday-notice {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--color-danger) 25%, transparent);
}

.holiday-eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.holiday-label {
  font-weight: 600;
  font-size: var(--text-base);
}

.week-table {
  inline-size: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-variant-numeric: tabular-nums;
}

.week-table th,
.week-table td {
  padding: var(--space-3) var(--space-4);
  text-align: start;
  font-size: var(--text-sm);
  font-weight: 500;
  border-block-end: 1px solid var(--color-border);
}

.week-table thead th {
  background: var(--color-surface-muted);
  color: var(--color-text-subtle);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.week-table tbody tr:last-child th,
.week-table tbody tr:last-child td {
  border-block-end: none;
}

.day-cell {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-weight: 600;
  color: var(--color-text);
}

.day-hint {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px var(--space-2);
  border-radius: var(--radius-pill);
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}

.hours-cell {
  color: var(--color-text-muted);
}

.is-highlighted {
  background: var(--color-accent-soft);
}

.is-highlighted .day-cell,
.is-highlighted .hours-cell {
  color: var(--color-accent-strong);
}

.is-highlighted .day-hint {
  background: var(--color-accent-strong);
  color: var(--color-text-inverse);
}

.visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
