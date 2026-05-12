<script setup lang="ts">
import type { DailySchedule, OfficeDetail } from '~/types/umbraco'
import { todayInZone } from '~/utils/officeSchedule'

const props = defineProps<{
  office: OfficeDetail
  userTimezone: string | null
}>()

/**
 * Upcoming holidays / closures are override entries from today forward
 * where the office is closed. Overrides that *change* hours (e.g. extended
 * hours) aren't holidays — we filter them out by requiring `isClosed`.
 */
const upcomingHolidays = computed<DailySchedule[]>(() => {
  const fromDate = todayInZone(props.userTimezone ?? props.office.timezone)
  return props.office.schedule.filter(
    (d) => d.date >= fromDate && d.isOverride && d.isClosed,
  )
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return dateFormatter.format(new Date(Date.UTC(y, m - 1, d)))
}
</script>

<template>
  <section class="holidays" aria-labelledby="holidays-heading">
    <header class="header">
      <h2 id="holidays-heading">Upcoming holidays</h2>
      <p class="caption">Days the office will be closed in the next two weeks.</p>
    </header>

    <ul v-if="upcomingHolidays.length" role="list" class="list">
      <li v-for="day in upcomingHolidays" :key="day.date" class="item">
        <span class="date">{{ formatDate(day.date) }}</span>
        <span class="label">{{ day.overrideLabel ?? 'Closed' }}</span>
      </li>
    </ul>

    <p v-else class="empty">No closures scheduled in the visible window.</p>
  </section>
</template>

<style scoped>
.holidays {
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

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.date {
  font-weight: 600;
  color: var(--color-text);
}

.label {
  color: var(--color-accent-strong);
  font-weight: 500;
  text-align: end;
}

.empty {
  margin: 0;
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
</style>
