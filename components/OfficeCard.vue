<script setup lang="ts">
import type { OfficeDetail } from '~/types/umbraco'
import { findTodaySchedule, formatHoursRange } from '~/utils/officeSchedule'

const props = defineProps<{
  office: OfficeDetail
  userTimezone: string | null
}>()

const today = computed(() =>
  findTodaySchedule(props.office, props.userTimezone),
)

const todayHours = computed(() =>
  today.value && !today.value.isClosed
    ? formatHoursRange(today.value.open, today.value.close)
    : null,
)

const statusLine = computed(() => {
  const { status } = props.office
  if (status.isOpen) {
    if (status.timeUntilChange) {
      return `Closes in ${status.timeUntilChange}`
    }
    return status.statusText
  }
  if (status.nextChangeDay) {
    const day = status.nextChangeDay.toLowerCase() === 'today'
      ? 'today'
      : status.nextChangeDay
    return `Opens ${day}`
  }
  return status.statusText
})

const upcoming = computed(() =>
  props.office.schedule
    .filter((d) => d.date > (today.value?.date ?? ''))
    .slice(0, 3),
)

const localityLabel = computed(() => {
  const label = props.office.label?.trim()
  return label && label.length > 0 ? label : props.office.city
})
</script>

<template>
  <article class="office-card surface" :aria-labelledby="`office-${office.id}`">
    <header class="card-head">
      <div>
        <p class="country">{{ office.country }}</p>
        <h3 :id="`office-${office.id}`" class="city">{{ localityLabel }}</h3>
      </div>
      <OfficeStatusBadge :status="office.status" />
    </header>

    <dl class="meta">
      <div class="meta-row">
        <dt>Today</dt>
        <dd>
          <span v-if="today?.isOverride && today.overrideLabel" class="override">
            {{ today.overrideLabel }}
          </span>
          <span v-else-if="todayHours">{{ todayHours }}</span>
          <span v-else class="muted">Closed today</span>
        </dd>
      </div>
      <div class="meta-row">
        <dt>Status</dt>
        <dd>{{ statusLine }}</dd>
      </div>
      <div class="meta-row">
        <dt>Timezone</dt>
        <dd class="mono">{{ office.timezone }}</dd>
      </div>
    </dl>

    <details v-if="upcoming.length" class="upcoming">
      <summary>Upcoming days</summary>
      <ul role="list" class="upcoming-list">
        <li v-for="d in upcoming" :key="d.date">
          <span class="day">{{ d.dayOfWeek }}</span>
          <span class="hours">
            <template v-if="d.isOverride && d.overrideLabel">
              {{ d.overrideLabel }}
            </template>
            <template v-else-if="!d.isClosed && d.open && d.close">
              {{ d.open }} – {{ d.close }}
            </template>
            <template v-else>Closed</template>
          </span>
        </li>
      </ul>
    </details>
  </article>
</template>

<style scoped>
.office-card {
  padding: var(--space-5) var(--space-5) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  container-type: inline-size;
  transition:
    box-shadow var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out);
}

.office-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .office-card,
  .office-card:hover {
    transition: none;
    transform: none;
  }
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.country {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-block-end: var(--space-1);
}

.city {
  font-size: var(--text-xl);
  font-weight: 650;
  margin: 0;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-4) 0 0;
  border-block-start: 1px dashed var(--color-border);
}

.meta-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: var(--space-3);
  font-size: var(--text-sm);
  align-items: baseline;
}

.meta-row dt {
  color: var(--color-text-subtle);
  font-weight: 500;
}

.meta-row dd {
  margin: 0;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.muted {
  color: var(--color-text-subtle);
}

.override {
  display: inline-flex;
  padding: 2px var(--space-2);
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
}

.mono {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.upcoming {
  margin-block-start: auto;
  border-block-start: 1px dashed var(--color-border);
  padding-block-start: var(--space-3);
}

.upcoming summary {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-block: var(--space-2);
}

.upcoming summary::-webkit-details-marker {
  display: none;
}

.upcoming summary::after {
  content: '+';
  margin-inline-start: auto;
  font-size: var(--text-base);
  color: var(--color-text-subtle);
  transition: transform var(--duration-base) var(--ease-out);
}

.upcoming[open] summary::after {
  content: '–';
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-block-start: var(--space-2);
}

.upcoming-list li {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.upcoming-list .day {
  color: var(--color-text-subtle);
}

@container (min-width: 22rem) {
  .city {
    font-size: var(--text-2xl);
  }
}
</style>
